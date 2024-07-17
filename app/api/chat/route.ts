// Route Handlers
// POST localhost:3000/api/chat
import { Configuration, OpenAIApi} from "openai-edge";
import {OpenAIStream, StreamingTextResponse} from "ai";

export const runtime = 'edge'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config);

export async function POST(request: Request) {
    const { messages} = await request.json();

    console.log(messages);

    //Getting response from GPT
    const response = await openai.createChatCompletion({
        model: 'gpt-4o',
        stream: true,
        messages: [
            {role: "system", content: "You will assistant in helping clients with their car needs. You will output: Three Approximate Costs."},
            ...messages
        ]
    })

    //Stream data to FE
    const stream = await OpenAIStream(response);

    //Send stream as response to client
    return new StreamingTextResponse(stream);

}