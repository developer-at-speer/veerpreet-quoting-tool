import { MongoClient } from "mongodb";
import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

export const runtime = 'edge';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

export async function POST(request: Request) {
    const { messages, carDetails } = await request.json();

    // Fetch inventory data (if necessary)
    const baseURL = process.env.BASE_URL || "http://localhost:3000";
    const inventoryResponse = await fetch(`${baseURL}/api/inventory`);
    if (!inventoryResponse.ok) {
        return new Response(JSON.stringify({ error: 'Error fetching inventory data' }), { status: 500 });
    }
    const inventoryData = await inventoryResponse.json();

    // Create chat completion
    const response = await openai.createChatCompletion({
        model: 'gpt-4',
        stream: true,
        messages: [
            { 
                role: "system", 
                content: 
                `You are VeerAI. If the user prompts something related to a car, you will assist in car needs. With the car details: ${carDetails}, return the following:
                - ${carDetails} recommended Oil Grade from the Manufacture
                - ${carDetails} manufacturer recommended Oil Filter OEM Part
                - The FRAM Oil Filter associated with the ${carDetails} manufacturer recommended Oil Filter OEM Part, make sure it is only from Extra Guard and it should start with PH or CH.
                
                Do not include sentences, format it like this (this is an example):
                    Oil Grade: 5W20
                    OEM Oil Filter: CH1234
                    FRAM Oil Filter: PH3383
                    Comment: Spin-on Oil Filter

                If the user does not prompt anything car related, act like ChatGPT except your name is still VeerAI.
                `
            },
            ...messages,
        ]
    });

    console.log('Received messages:', messages);
    console.log('Car details:', carDetails);

    const stream = await OpenAIStream(response);

    return new StreamingTextResponse(stream);
}

