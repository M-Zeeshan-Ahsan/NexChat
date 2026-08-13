import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const dbName = "nexchat";
const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

export const connection = async () => {
  const connect = await client.connect();
  return await connect.db(dbName);
};
