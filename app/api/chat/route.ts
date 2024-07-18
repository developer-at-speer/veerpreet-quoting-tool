// app/api/chat/route.ts
import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = 'edge';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

const prompt = "You will assist in helping clients with their car needs. You will output: Three Approximate Costs.";

export async function POST(request: Request) {
    const { messages } = await request.json();

    console.log(messages);

    // Fetch the JSON data from the /api/inventory endpoint
    const inventoryResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/inventory`);
    if (!inventoryResponse.ok) {
        return new Response(JSON.stringify({ error: 'Error fetching inventory data' }), { status: 500 });
    }
    const inventoryData = await inventoryResponse.json();
    console.log('Inventory Data:', inventoryData);

    // Getting response from GPT
    const response = await openai.createChatCompletion({
        model: 'gpt-4',
        stream: true,
        messages: [
            { role: "system", 
                content: 
                `You will assist in helping clients with their car needs. 
                With this inventory data: ${JSON.stringify(inventoryData)}, return the following:
                - 3 recommendations
                - Part Number for the recommendations
                - Cost of the recommendations`},
            ...messages,
        ]
    });

    // Stream data to FE
    const stream = await OpenAIStream(response);

    // Send stream as response to client
    return new StreamingTextResponse(stream);
}
