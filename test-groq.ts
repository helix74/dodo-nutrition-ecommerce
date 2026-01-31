
import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testGroq() {
  console.log("Testing Groq connection...");
  const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    const result = await streamText({
      model: groq("llama-3.1-8b-instant"),
      messages: [{ role: "user", content: "Hello, are you working?" }],
    });

    console.log("Stream started.");
    for await (const part of result.textStream) {
      process.stdout.write(part);
    }
    console.log("\nDone.");
  } catch (error) {
    console.error("Error:", error);
  }
}

testGroq();
