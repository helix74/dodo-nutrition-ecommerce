import { defineQuery } from "next-sanity";

// =============================================================================
// ANALYTICS QUERIES - Real data from Sanity
// =============================================================================

/**
 * Get total revenue and order counts
 * Returns: { totalRevenue, orderCount, todayRevenue, todayOrders }
 */
export const ANALYTICS_SUMMARY_QUERY = defineQuery(`
  {
    "totalRevenue": coalesce(math::sum(*[_type == "order"].total), 0),
    "orderCount": count(*[_type == "order"]),
    "todayRevenue": coalesce(math::sum(*[_type == "order" && createdAt >= $todayStart].total), 0),
    "todayOrders": count(*[_type == "order" && createdAt >= $todayStart]),
    "weekRevenue": coalesce(math::sum(*[_type == "order" && createdAt >= $weekStart].total), 0),
    "weekOrders": count(*[_type == "order" && createdAt >= $weekStart]),
    "monthRevenue": coalesce(math::sum(*[_type == "order" && createdAt >= $monthStart].total), 0),
    "monthOrders": count(*[_type == "order" && createdAt >= $monthStart])
  }
`);

/**
 * Get orders by status for dashboard stats
 */
export const ORDERS_BY_STATUS_QUERY = defineQuery(`
  {
    "pending": count(*[_type == "order" && status == "pending"]),
    "confirmed": count(*[_type == "order" && status == "confirmed"]),
    "paid": count(*[_type == "order" && status == "paid"]),
    "shipped": count(*[_type == "order" && status == "shipped"]),
    "delivered": count(*[_type == "order" && status == "delivered"]),
    "cancelled": count(*[_type == "order" && status == "cancelled"])
  }
`);

/**
 * Get revenue per day for chart
 * Returns array of { date, revenue, orders }
 */
export const DAILY_REVENUE_QUERY = defineQuery(`
  *[_type == "order" && createdAt >= $startDate] {
    "date": createdAt,
    "revenue": total
  } | order(createdAt asc)
`);

/**
 * Get top selling products
 * Note: This requires aggregating order items - simplified version
 */
export const TOP_PRODUCTS_QUERY = defineQuery(`
  *[_type == "order"] {
    "items": items[] {
      "productId": product._ref,
      "quantity": quantity,
      "revenue": priceAtPurchase * quantity
    }
  }
`);

/**
 * Simpler: Get all products with their stock levels (for now)
 */
export const PRODUCTS_STOCK_SUMMARY_QUERY = defineQuery(`
  {
    "totalProducts": count(*[_type == "product"]),
    "inStock": count(*[_type == "product" && stock > 0]),
    "lowStock": count(*[_type == "product" && stock > 0 && stock <= 10]),
    "outOfStock": count(*[_type == "product" && stock <= 0]),
    "products": *[_type == "product"] | order(stock asc) [0...10] {
      _id,
      name,
      stock,
      priceRetail,
      "imageUrl": images[0].asset->url
    }
  }
`);

/**
 * Get recent orders for dashboard
 */
export const RECENT_ORDERS_DASHBOARD_QUERY = defineQuery(`
  *[_type == "order"] | order(createdAt desc) [0...5] {
    _id,
    orderNumber,
    total,
    status,
    createdAt,
    "customerName": address.name,
    "itemCount": count(items)
  }
`);

/**
 * Get orders for a date range (for chart)
 */
export const ORDERS_DATE_RANGE_QUERY = defineQuery(`
  *[_type == "order" && createdAt >= $startDate && createdAt <= $endDate] {
    _id,
    total,
    createdAt,
    status
  } | order(createdAt asc)
`);
