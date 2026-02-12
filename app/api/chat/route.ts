import { streamText, convertToModelMessages } from "ai";
import { auth } from "@clerk/nextjs/server";
import { createShoppingAgent } from "@/lib/ai/shopping-agent";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

// Rate limit: 10 requests per minute per IP
const CHAT_RATE_LIMIT = 10;
const CHAT_WINDOW_MS = 60 * 1000; // 1 minute

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(
      `chat:${clientIP}`,
      CHAT_RATE_LIMIT,
      CHAT_WINDOW_MS
    );

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: "Trop de messages. Veuillez patienter un moment.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil(rateLimitResult.resetIn / 1000).toString(),
          },
        }
      );
    }

    const { messages } = await request.json();

    // Get the user's session - userId will be null if not authenticated
    const { userId } = await auth();

    // Create agent config with user context
    const { model, system, tools } = createShoppingAgent({ userId });

    const coreMessages = await convertToModelMessages(messages);

    const result = await streamText({
      model,
      system,
      tools,
      messages: coreMessages,
      // maxSteps: 5,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("StreamText error:", error);
    // Don't leak internal error details to the client
    return new Response(
      JSON.stringify({
        error: "Une erreur est survenue. Veuillez réessayer.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
