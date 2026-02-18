type ProductData = {
  id: string;
  name: string;
  category: string;
  price: number;
};

type CartItemData = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

function hasFbq(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

function hasGtag(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

export function trackPageView(url: string): void {
  if (hasFbq()) {
    window.fbq!("track", "PageView");
  }
  if (hasGtag()) {
    window.gtag!("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: url,
    });
  }
}

export function trackViewContent(product: ProductData): void {
  if (hasFbq()) {
    window.fbq!("track", "ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.category,
      content_type: "product",
      value: product.price,
      currency: "TND",
    });
  }
  if (hasGtag()) {
    window.gtag!("event", "view_item", {
      currency: "TND",
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
        },
      ],
    });
  }
}

export function trackAddToCart(product: CartItemData): void {
  if (hasFbq()) {
    window.fbq!("track", "AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price * product.quantity,
      currency: "TND",
    });
  }
  if (hasGtag()) {
    window.gtag!("event", "add_to_cart", {
      currency: "TND",
      value: product.price * product.quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity,
        },
      ],
    });
  }
}

export function trackInitiateCheckout(
  value: number,
  items: CartItemData[]
): void {
  if (hasFbq()) {
    window.fbq!("track", "InitiateCheckout", {
      content_ids: items.map((i) => i.id),
      content_type: "product",
      num_items: items.reduce((sum, i) => sum + i.quantity, 0),
      value,
      currency: "TND",
    });
  }
  if (hasGtag()) {
    window.gtag!("event", "begin_checkout", {
      currency: "TND",
      value,
      items: items.map((i) => ({
        item_id: i.id,
        item_name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    });
  }
}

export function trackPurchase(
  orderId: string,
  value: number,
  items: CartItemData[]
): void {
  if (hasFbq()) {
    window.fbq!("track", "Purchase", {
      content_ids: items.map((i) => i.id),
      content_type: "product",
      num_items: items.reduce((sum, i) => sum + i.quantity, 0),
      value,
      currency: "TND",
    });
  }
  if (hasGtag()) {
    window.gtag!("event", "purchase", {
      transaction_id: orderId,
      currency: "TND",
      value,
      items: items.map((i) => ({
        item_id: i.id,
        item_name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    });
  }
}
