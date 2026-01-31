import { streamText, convertToModelMessages } from "ai";
import { auth } from "@clerk/nextjs/server";
import { createShoppingAgent } from "@/lib/ai/shopping-agent";

export async function POST(request: Request) {
  try {
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(`Internal Error: ${errorMessage}`, { status: 500 });
  }
}
