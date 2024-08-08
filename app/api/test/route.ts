// project/app/api/test/route.ts
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

// Function to connect to database
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const database = client.db("ChatDB");
    const collection = database.collection("Chat");

    return { database, collection };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error(`Error connecting to MongoDB: ${error}`);
  }
}

// GET Request to connect to server
export async function GET() {
  try {
    const { database, collection } = await connectToDatabase();
    await client.close();
    return NextResponse.json({ message: "Connected successfully to MongoDB" });
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}

// POST Request to add message to server
export async function POST(req: Request) {
  try {
    const { database, collection } = await connectToDatabase();
    const { chatMessage } = await req.json();

    const result = await collection.insertOne({ message: chatMessage, timestamp: new Date() });
    console.log("Message saved to MongoDB!");

    await client.close();
    return NextResponse.json({ message: "Chat message saved successfully", result });
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}