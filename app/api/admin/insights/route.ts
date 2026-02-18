import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";

// Initialize Groq provider
const groq = createGroq();
import { client } from "@/sanity/lib/client";
import {
  ORDERS_LAST_7_DAYS_QUERY,
  ORDER_STATUS_DISTRIBUTION_QUERY,
  TOP_SELLING_PRODUCTS_QUERY,
  PRODUCTS_INVENTORY_QUERY,
  UNFULFILLED_ORDERS_QUERY,
  REVENUE_BY_PERIOD_QUERY,
} from "@/lib/sanity/queries/stats";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

interface OrderItem {
  quantity: number;
  priceAtPurchase: number;
  productName: string;
  productId: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
  items: OrderItem[];
}

interface StatusDistribution {
  paid: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface ProductSale {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface UnfulfilledOrder {
  _id: string;
  orderNumber: string;
  total: number;
  createdAt: string;
  email: string;
  itemCount: number;
}

interface RevenuePeriod {
  currentPeriod: number;
  previousPeriod: number;
  currentOrderCount: number;
  previousOrderCount: number;
}

export async function GET(request: Request) {
  try {
    // Check admin authorization using JWT session
    const isAuthed = await isAdminAuthenticated();
    if (!isAuthed) {
      return Response.json(
        { success: false, error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Rate limiting: 5 requests per minute
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(`admin-insights:${clientIP}`, 5, 60 * 1000);
    if (!rateLimitResult.allowed) {
      return Response.json(
        { success: false, error: "Trop de requêtes. Veuillez patienter." },
        { status: 429 }
      );
    }

    // Calculate date ranges
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Fetch all analytics data in parallel
    const [
      recentOrders,
      statusDistribution,
      productSales,
      productsInventory,
      unfulfilledOrders,
      revenuePeriod,
    ] = await Promise.all([
      client.fetch<Order[]>(ORDERS_LAST_7_DAYS_QUERY, {
        startDate: sevenDaysAgo.toISOString(),
      }),
      client.fetch<StatusDistribution>(ORDER_STATUS_DISTRIBUTION_QUERY),
      client.fetch<ProductSale[]>(TOP_SELLING_PRODUCTS_QUERY),
      client.fetch<Product[]>(PRODUCTS_INVENTORY_QUERY),
      client.fetch<UnfulfilledOrder[]>(UNFULFILLED_ORDERS_QUERY),
      client.fetch<RevenuePeriod>(REVENUE_BY_PERIOD_QUERY, {
        currentStart: sevenDaysAgo.toISOString(),
        previousStart: fourteenDaysAgo.toISOString(),
      }),
    ]);

    // Aggregate top selling products
    const productSalesMap = new Map<
      string,
      { name: string; totalQuantity: number; revenue: number }
    >();

    for (const sale of productSales) {
      if (!sale.productId) continue;
      const existing = productSalesMap.get(sale.productId);
      if (existing) {
        existing.totalQuantity += sale.quantity;
        existing.revenue += sale.quantity * (sale.productPrice || 0);
      } else {
        productSalesMap.set(sale.productId, {
          name: sale.productName || "Unknown",
          totalQuantity: sale.quantity,
          revenue: sale.quantity * (sale.productPrice || 0),
        });
      }
    }

    const topProducts = Array.from(productSalesMap.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    // Find products needing restock (low stock but high sales)
    const productSalesById = new Map(
      Array.from(productSalesMap.entries()).map(([id, data]) => [
        id,
        data.totalQuantity,
      ])
    );

    const needsRestock = productsInventory
      .filter((p) => {
        const salesQty = productSalesById.get(p._id) || 0;
        return p.stock <= 5 && salesQty > 0;
      })
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);

    // Slow moving inventory (in stock but no sales)
    const slowMoving = productsInventory
      .filter((p) => {
        const salesQty = productSalesById.get(p._id) || 0;
        return p.stock > 10 && salesQty === 0;
      })
      .slice(0, 5);

    // Helper to calculate days since order
    const getDaysSinceOrder = (createdAt: string) => {
      const orderDate = new Date(createdAt);
      const diffTime = now.getTime() - orderDate.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    // Calculate metrics
    const currentRevenue = revenuePeriod.currentPeriod || 0;
    const previousRevenue = revenuePeriod.previousPeriod || 0;
    const revenueChange =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : currentRevenue > 0
          ? 100
          : 0;

    const avgOrderValue =
      recentOrders.length > 0
        ? recentOrders.reduce((sum, o) => sum + (o.total || 0), 0) /
          recentOrders.length
        : 0;

    // Prepare data summary for AI
    const dataSummary = {
      salesTrends: {
        currentWeekRevenue: currentRevenue,
        previousWeekRevenue: previousRevenue,
        revenueChangePercent: revenueChange.toFixed(1),
        currentWeekOrders: revenuePeriod.currentOrderCount || 0,
        previousWeekOrders: revenuePeriod.previousOrderCount || 0,
        avgOrderValue: avgOrderValue.toFixed(2),
        topProducts: topProducts.map((p) => ({
          name: p.name,
          unitsSold: p.totalQuantity,
          revenue: p.revenue.toFixed(2),
        })),
      },
      inventory: {
        needsRestock: needsRestock.map((p) => ({
          name: p.name,
          stock: p.stock,
          category: p.category,
        })),
        slowMoving: slowMoving.map((p) => ({
          name: p.name,
          stock: p.stock,
          category: p.category,
        })),
        totalProducts: productsInventory.length,
        lowStockCount: productsInventory.filter((p) => p.stock <= 5).length,
      },
      operations: {
        statusDistribution,
        unfulfilledOrders: unfulfilledOrders.map((o) => ({
          orderNumber: o.orderNumber,
          total: o.total,
          daysSinceOrder: getDaysSinceOrder(o.createdAt),
          itemCount: o.itemCount,
        })),
        urgentOrders: unfulfilledOrders.filter(
          (o) => getDaysSinceOrder(o.createdAt) > 2
        ).length,
      },
    };

    // Generate AI insights
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      system: `Tu es un assistant expert en analyse e-commerce. Analyse les données fournies et génère des insights actionnables pour l'administrateur de la boutique. Réponds UNIQUEMENT en français.

Ta réponse doit être un JSON valide avec cette structure exacte :
{
  "salesTrends": {
    "summary": "Résumé de 2-3 phrases sur les performances de vente",
    "highlights": ["point clé 1", "point clé 2", "point clé 3"],
    "trend": "up" | "down" | "stable"
  },
  "inventory": {
    "summary": "Résumé de 2-3 phrases sur l'état du stock",
    "alerts": ["alerte 1", "alerte 2"],
    "recommendations": ["recommandation 1", "recommandation 2"]
  },
  "actionItems": {
    "urgent": ["action urgente 1", "action urgente 2"],
    "recommended": ["action recommandée 1", "action recommandée 2"],
    "opportunities": ["opportunité 1", "opportunité 2"]
  }
}

Consignes :
- Sois précis avec les chiffres et noms de produits
- Priorise les insights actionnables
- Garde les points, alertes et recommandations concis (moins de 100 caractères chacun)
- Concentre-toi sur ce que l'admin peut faire AUJOURD'HUI
- Utilise TND pour la devise`,
      prompt: `Analyse les données de cette boutique e-commerce et fournis des insights :

${JSON.stringify(dataSummary, null, 2)}

Génère les insights au format JSON requis.`,
    });

    // Parse AI response
    let insights: {
      salesTrends: {
        summary: string;
        highlights: string[];
        trend: "up" | "down" | "stable";
      };
      inventory: {
        summary: string;
        alerts: string[];
        recommendations: string[];
      };
      actionItems: {
        urgent: string[];
        recommended: string[];
        opportunities: string[];
      };
    };
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      // Fallback insights if parsing fails
      insights = {
        salesTrends: {
          summary: `Revenus cette semaine : ${currentRevenue.toFixed(2)} TND (${revenueChange > 0 ? "+" : ""}${revenueChange.toFixed(1)}% vs semaine dernière)`,
          highlights: [
            `${revenuePeriod.currentOrderCount || 0} commandes cette semaine`,
            `Panier moyen : ${avgOrderValue.toFixed(2)} TND`,
            topProducts[0]
              ? `Meilleure vente : ${topProducts[0].name}`
              : "Pas encore de données de ventes",
          ],
          trend:
            revenueChange > 5 ? "up" : revenueChange < -5 ? "down" : "stable",
        },
        inventory: {
          summary: `${needsRestock.length} produits à réapprovisionner. ${slowMoving.length} produits sans ventes récentes.`,
          alerts: needsRestock
            .slice(0, 2)
            .map((p) => `${p.name} : seulement ${p.stock} restant(s)`),
          recommendations: [
            "Vérifier les stocks faibles avant le week-end",
            "Envisager des promotions pour les invendus",
          ],
        },
        actionItems: {
          urgent:
            unfulfilledOrders.length > 0
              ? [`Expédier ${unfulfilledOrders.length} commandes en attente`]
              : ["Toutes les commandes sont traitées !"],
          recommended: ["Vérifier les niveaux de stock", "Contrôler les fiches produits"],
          opportunities: ["Les produits vedettes génèrent plus de ventes"],
        },
      };
    }

    return Response.json({
      success: true,
      insights,
      rawMetrics: {
        currentRevenue,
        previousRevenue,
        revenueChange: revenueChange.toFixed(1),
        orderCount: revenuePeriod.currentOrderCount || 0,
        avgOrderValue: avgOrderValue.toFixed(2),
        unfulfilledCount: unfulfilledOrders.length,
        lowStockCount: productsInventory.filter((p) => p.stock <= 5).length,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to generate insights:", error);
    return Response.json(
      {
        success: false,
        error: "Échec de la génération des analyses",
      },
      { status: 500 }
    );
  }
}
