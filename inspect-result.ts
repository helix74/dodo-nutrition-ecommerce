
import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function inspectResult() {
  console.log("Inspecting streamText result...");
  const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    const result = await streamText({
      model: groq("llama-3.1-8b-instant"),
      messages: [{ role: "user", content: "Hello" }],
    });

    console.log("Stream created.");
    console.log("Result keys:", Object.keys(result));
    console.log("Result prototype:", Object.getPrototypeOf(result));
    
    // Check specific methods
    const methods = [
      'toDataStreamResponse',
      'toTextStreamResponse',
      'toAIStreamResponse',
      'pipeDataStreamToResponse',
      'pipeTextStreamToResponse',
      'pipeAIStreamToResponse'
    ];
    
    methods.forEach(m => {
      console.log(`Has ${m}:`, typeof (result as any)[m]);
    });

  } catch (error) {
    console.error("Error executing streamText:", error);
  }
}

inspectResult();
