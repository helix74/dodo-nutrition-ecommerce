import { defineQuery } from "next-sanity";

/**
 * Get total product count
 */
export const PRODUCT_COUNT_QUERY = defineQuery(`count(*[_type == "product"])`);

/**
 * Get total order count
 */
export const ORDER_COUNT_QUERY = defineQuery(`count(*[_type == "order"])`);

/**
 * Get total revenue from completed orders
 */
export const TOTAL_REVENUE_QUERY = defineQuery(`math::sum(*[
  _type == "order"
  && status in ["paid", "shipped", "delivered"]
].total)`);

