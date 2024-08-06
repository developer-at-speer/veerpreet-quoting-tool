import { MongoClient } from "mongodb";
import { NextResponse } from "next/server"; // API provided by Next.js for creating HTTP responses within API routes and middleware

// Initialzing a new MongoClient instance 
const uri = process.env.MONGODB_URI as string; 
const client = new MongoClient(uri); // This variable now holds the MongoClient instance, which can be used to connect to and interact with the MongoDB database.

// Function to connect to database
async function connectToDatabase() { // An async function is a function declared with the async keyword that enables the use of the await keyword within it. async functions always return a Promise, and their primary purpose is to handle asynchronous operations more straightforwardly.
  try {
    await client.connect(); // Connecting to MongoDB -> await functions are used to pause the execution of an asynchronous function until a Promise is resolved or rejected.
    console.log("Connected successfully to MongoDB");

    const database = client.db("CarDB"); // Fetches the database 
    const collection = database.collection("CarDetails"); // Fetches the collection from the database

    return { database, collection }; 
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error(`Error connecting to MongoDB: ${error}`);
  }
}

// GET Request to connect to server
export async function GET() {
  try {
    const { database, collection } = await connectToDatabase(); // Calls function to connect to database
    await client.close();
    return NextResponse.json({ message: "Connected successfully to MongoDB" });
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}

// POST Request to add car details to server
export async function POST(req: Request) {
  try {
    const { database, collection } = await connectToDatabase(); // Establishing connection to Mongo
    const carDetails = await req.json(); // Gets car details 

    const result = await collection.insertOne({ ...carDetails, timestamp: new Date() }); // Inserts the car details into the CarDetails collection, adding a timestamp field with the current date and time.
    console.log("Car details saved to MongoDB!");

    await client.close();
    return NextResponse.json({ message: "Car details saved successfully", result });
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}