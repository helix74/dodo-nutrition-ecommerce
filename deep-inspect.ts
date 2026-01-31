
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
    
    // Log ALL keys on the result object
    console.log("Result keys:", Object.keys(result));
    
    // Log prototype chain to find inherited methods
    let proto = Object.getPrototypeOf(result);
    while (proto) {
        console.log("Prototype keys:", Object.getOwnPropertyNames(proto));
        proto = Object.getPrototypeOf(proto);
    }

  } catch (error) {
    console.error("Error executing streamText:", error);
  }
}

inspectResult();
