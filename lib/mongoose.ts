import mongoose from "mongoose";

let isConnected = false; // variable to check if Mongoose is connected

export const connectToDb = async () => {
  mongoose.set('strictQuery', true); // Set strict query mode for Mongoose to prevent unknown field queries.

  // need to have specific MongoDB URL to connect
  if (!process.env.MONGODB_URL) return console.log("MongoDB_URL Not Found");

  if (isConnected) return console.log("MongoDB connection already established");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log(error);
  }

}