import mongoose from "mongoose";

import { app } from "./app";

const startAuthServer = async () => {
  
  // Check if ENV Variables exist
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined!");
  }

  try {
    // ========================Connecting to Auth DB========================
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to Auth MongoDB successfully !!!!!");
  } catch (err) {
    console.error("Error Connecting to Auth DB:", err);
  }

  const PORT = 3000;

  // ========================Starting Auth Server========================
  app.listen(PORT, () => {
    console.log(`AUTH SERVICE listening on PORT: ${PORT} !!!!!`);
  });
};

startAuthServer();
