"use server";

import { writeClient } from "@/sanity/lib/client";

// ============ PRODUCTS ============

export interface ProductData {
  _id: string;
  _type: string;
  name: string;
  slug: { current: string };
  price: number;
  stock: number;
  description?: string;
  material?: string;
  color?: string;
  dimensions?: string;
  featured?: boolean;
  assemblyRequired?: boolean;
  images?: Array<{
    _key: string;
    _type: string;
    asset: { _ref: string; url?: string };
  }>;
  category?: { _ref: string; name?: string };
  brand?: { _ref: string; name?: string };
  _rev?: string;
  _createdAt?: string;
  _updatedAt?: string;
}

export async function getProducts(): Promise<ProductData[]> {
  return writeClient.fetch(
    `*[_type == "product"] | order(_updatedAt desc) {
      _id, _type, name, slug, price, stock, description, material, color,
      dimensions, featured, assemblyRequired, _rev, _createdAt, _updatedAt,
      "images": images[] { _key, _type, asset-> { _ref, url } },
      "category": category-> { _ref, name },
      "brand": brand-> { _ref, name }
    }`,
    {},
    { cache: "no-store" }
  );
}

export async function getProduct(id: string): Promise<ProductData | null> {
  return writeClient.fetch(
    `*[_type == "product" && _id == $id][0] {
      _id, _type, name, slug, price, stock, description, material, color,
      dimensions, featured, assemblyRequired, _rev, _createdAt, _updatedAt,
      "images": images[] { _key, _type, asset-> { _ref, url } },
      "category": category-> { _ref, name },
      "brand": brand-> { _ref, name }
    }`,
    { id },
    { cache: "no-store" }
  );
}

// ============ ORDERS ============

export interface OrderData {
  _id: string;
  _type: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  phone?: string;
  status: string;
  totalPrice: number;
  currency?: string;
  _createdAt: string;
  _updatedAt?: string;
  _rev?: string;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  items?: Array<{
    _key: string;
    product: { _ref: string; name?: string };
    quantity: number;
    price: number;
  }>;
}

export async function getOrders(): Promise<OrderData[]> {
  return writeClient.fetch(
    `*[_type == "order"] | order(_createdAt desc) {
      _id, _type, orderNumber, customerName, customerEmail, phone,
      status, totalPrice, currency, _createdAt, _updatedAt, _rev,
      shippingAddress,
      "items": items[] {
        _key, quantity, price,
        "product": product-> { _ref, name }
      }
    }`,
    {},
    { cache: "no-store" }
  );
}

export async function getOrder(id: string): Promise<OrderData | null> {
  return writeClient.fetch(
    `*[_type == "order" && _id == $id][0] {
      _id, _type, orderNumber, customerName, customerEmail, phone,
      status, totalPrice, currency, _createdAt, _updatedAt, _rev,
      shippingAddress,
      "items": items[] {
        _key, quantity, price,
        "product": product-> { _ref, name }
      }
    }`,
    { id },
    { cache: "no-store" }
  );
}

// ============ SUPPLIERS ============

export interface SupplierRow {
  _id: string;
  name: string;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  productCount: number;
}

export async function getSuppliers(): Promise<SupplierRow[]> {
  return writeClient.fetch(
    `*[_type == "supplier"] | order(name asc) {
      _id,
      name,
      contactName,
      phone,
      email,
      "productCount": count(products)
    }`,
    {},
    { cache: "no-store" }
  );
}

// ============ INVOICES ============

export interface InvoiceRow {
  _id: string;
  invoiceNumber: string;
  supplierName: string | null;
  date: string | null;
  totalAmount: number | null;
  status: string;
  itemCount: number;
}

export async function getInvoices(): Promise<InvoiceRow[]> {
  return writeClient.fetch(
    `*[_type == "invoice"] | order(date desc) {
      _id,
      invoiceNumber,
      "supplierName": supplier->name,
      date,
      totalAmount,
      status,
      "itemCount": count(items)
    }`,
    {},
    { cache: "no-store" }
  );
}

// ============ LOW STOCK COUNT ============

export async function getLowStockCount(): Promise<number> {
  return writeClient.fetch(
    `count(*[_type == "product" && stock <= 5])`,
    {},
    { cache: "no-store" }
  );
}

// ============ STATS ============

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockCount: number;
  recentOrders: OrderData[];
  lowStockProducts: ProductData[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalProducts, totalOrders, totalRevenue, lowStockCount, recentOrders, lowStockProducts] =
    await Promise.all([
      writeClient.fetch(`count(*[_type == "product"])`, {}, { cache: "no-store" }),
      writeClient.fetch(`count(*[_type == "order"])`, {}, { cache: "no-store" }),
      writeClient.fetch(
        `math::sum(*[_type == "order"].totalPrice)`,
        {},
        { cache: "no-store" }
      ),
      writeClient.fetch(
        `count(*[_type == "product" && stock <= 5])`,
        {},
        { cache: "no-store" }
      ),
      writeClient.fetch(
        `*[_type == "order"] | order(_createdAt desc) [0...5] {
          _id, _type, orderNumber, customerName, status, totalPrice, currency, _createdAt
        }`,
        {},
        { cache: "no-store" }
      ),
      writeClient.fetch(
        `*[_type == "product" && stock <= 5] | order(stock asc) [0...10] {
          _id, _type, name, slug, price, stock, 
          "images": images[0] { _key, _type, asset-> { _ref, url } }
        }`,
        {},
        { cache: "no-store" }
      ),
    ]);

  return {
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    totalRevenue: totalRevenue || 0,
    lowStockCount: lowStockCount || 0,
    recentOrders: recentOrders || [],
    lowStockProducts: lowStockProducts || [],
  };
}
