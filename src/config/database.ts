import mongoose from "mongoose";
import { config } from "dotenv";
config()

export default async()=>{
    console.log(process.env.MONGODB_URI);
    try {
      const mongoURI = process.env.MONGODB_URI;
      if (!mongoURI) {
        throw new Error("Mongodb connection path is not geting in eviornment");
      }
      await mongoose.connect(mongoURI.trim());
      console.log("👽Mongodb connected successfully---->");
    } catch (error: any) {
      console.error(`🥅Database Connection Failed 🥅 `);
      console.error("sfsf", error?.message);
      process.exit(1);
    }

}