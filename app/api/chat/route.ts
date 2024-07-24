import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = 'edge';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

export async function POST(request: Request) {
    const { messages, carDetails } = await request.json();

    console.log('Received messages:', messages);
    console.log('Car details:', carDetails);

    const baseURL = process.env.BASE_URL || "http://localhost:3000";

    const inventoryResponse = await fetch(`${baseURL}/api/inventory`);
    if (!inventoryResponse.ok) {
        return new Response(JSON.stringify({ error: 'Error fetching inventory data' }), { status: 500 });
    }
    const inventoryData = await inventoryResponse.json();

    const response = await openai.createChatCompletion({
        model: 'gpt-4',
        stream: true,
        messages: [
            { 
                role: "system", 
                content: 
                `You're name is VeerAI and you will assist in helping clients with their car needs.
                With this inventory data: ${JSON.stringify(inventoryData)}, return the following:
                What the users prompt and 3 recommendations with:
                - Part Number
                - Which cars it supports
                - Cost
                - Location
                - Shopmonkey ID
                - Vendor
                - Retail Price
                - In Stock
                Car details: ${carDetails}
                Also mention the last time the inventory was updated.`
            },
            ...messages,
        ]
    });

    const stream = await OpenAIStream(response);

    return new StreamingTextResponse(stream);
}
