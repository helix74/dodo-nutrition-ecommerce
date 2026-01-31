
import { createShoppingAgent } from './lib/ai/shopping-agent';
import { streamText } from 'ai';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

async function testChat() {
  console.log('Testing Chat...');
  try {
    const { model, system, tools } = createShoppingAgent({ userId: null });
    console.log('Agent created.');
    
    const result = await streamText({
      model,
      system,
      tools,
      messages: [{ role: 'user', content: 'Hello' }],
      // maxSteps: 5,
    });
    
    console.log('Stream started.');
    for await (const part of result.textStream) {
        process.stdout.write(part);
    }
    console.log('\nDone.');
  } catch (error) {
    console.error('Error:', error);
  }
}

testChat();
