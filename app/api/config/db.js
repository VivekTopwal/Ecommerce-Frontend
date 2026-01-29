import mongoose from "mongoose";
let isConnected = false;

export default async function dbConnect() {
    if (isConnected) return;

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI not found in .env file");
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "next_app_db",
        });

        isConnected = conn.connections[0].readyState === 1;
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        throw new Error("Failed to connect to MongoDB");
    }
}

