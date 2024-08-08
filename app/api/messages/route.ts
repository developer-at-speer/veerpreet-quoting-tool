import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const database = client.db("ChatDB"); 
    const collection = database.collection("Messages");

    return { database, collection };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error(`Error connecting to MongoDB: ${error}`);
  }
}

export async function GET() {
  try {
    const { database, collection } = await connectToDatabase();
    await client.close();
    return NextResponse.json({ message: "Connected successfully to MongoDB" });
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}

export async function POST(req: Request) {
  try {
    const { database, collection } = await connectToDatabase();
    const messages = await req.json(); // Get messages from request body

    const result = await collection.insertOne({ messages, timestamp: new Date() }); // Save messages with timestamp
    console.log("Messages saved to MongoDB!");

    await client.close();
    return NextResponse.json({ message: "Messages saved successfully", result });
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}
