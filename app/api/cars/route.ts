import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

// Connects to the database
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const database = client.db("ChatDB");
    const collection = database.collection("CarDetails");

    return { database, collection };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error(`Error connecting to MongoDB: ${error}`);
  }
}

// GET Request to fetch all car details from the database
export async function GET() {
  try {
    const { collection } = await connectToDatabase();
    const carDetails = await collection.find({}).toArray();
    await client.close();
    return NextResponse.json(carDetails);
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}

// POST Request to add car details to the server
export async function POST(req: Request) {
  try {
    const { collection } = await connectToDatabase();
    const carDetails = await req.json();

    const result = await collection.insertOne({ ...carDetails, timestamp: new Date() });
    console.log("Car details saved to MongoDB!");

    await client.close();
    return NextResponse.json({ message: "Car added successfully", result });
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}

// DELETE Request to delete car details from the server
export async function DELETE(req: Request) {
  try {
    const { collection } = await connectToDatabase();
    const { carMake, model, year, trim, engineSize } = await req.json();

    console.log("Attempting to delete car:", { carMake, model, year, trim, engineSize });

    const result = await collection.deleteOne({ carMake, model, year, trim, engineSize });
    console.log("Delete result:", result);

    if (result.deletedCount === 0) {
      console.error("No matching car found to delete");
      return NextResponse.json({ message: "No matching car found to delete" }, { status: 404 });
    }

    console.log("Car details deleted from MongoDB!");

    await client.close();
    return NextResponse.json({ message: "Car deleted successfully", result });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json({ message: error });
  }
}
