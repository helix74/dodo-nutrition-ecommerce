import { createHash } from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const API_VERSION = "v18.0";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

interface UserData {
  email?: string;
  phone?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
}

interface CAPIItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CAPIEventPayload {
  eventName: "Purchase" | "AddToCart";
  eventId: string;
  eventSourceUrl: string;
  userData: UserData;
  value: number;
  items: CAPIItem[];
}

function buildUserData(userData: UserData): Record<string, string | undefined> {
  return {
    em: userData.email ? sha256(userData.email) : undefined,
    ph: userData.phone ? sha256(userData.phone) : undefined,
    client_ip_address: userData.clientIpAddress,
    client_user_agent: userData.clientUserAgent,
  };
}

export async function sendCAPIEvent(payload: CAPIEventPayload): Promise<void> {
  if (!PIXEL_ID || !ACCESS_TOKEN) return;

  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;

  const eventData = {
    event_name: payload.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.eventId,
    event_source_url: payload.eventSourceUrl,
    action_source: "website" as const,
    user_data: buildUserData(payload.userData),
    custom_data: {
      currency: "TND",
      value: payload.value,
      content_ids: payload.items.map((i) => i.id),
      content_type: "product",
      contents: payload.items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
        item_price: i.price,
      })),
      num_items: payload.items.reduce((sum, i) => sum + i.quantity, 0),
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [eventData],
        access_token: ACCESS_TOKEN,
      }),
    });

    if (!response.ok) {
      console.error(
        "Meta CAPI error:",
        response.status,
        await response.text()
      );
    }
  } catch (error) {
    console.error("Meta CAPI request failed:", error);
  }
}
