import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const User = mongoose.model("User", new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: String,
      password: String,
      role: String,
    }));

    const admin = await User.findOne({ email: "admin@store.com" }).select("+password");

    if (!admin) {
      console.log("❌ Admin not found!");
      process.exit(1);
    }

    console.log("\n📋 Admin Details:");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("Password (hashed):", admin.password);
    console.log("Password starts with $2:", admin.password.startsWith("$2"));

    // Test password
    const testPassword = "admin123";
    const isValid = await bcrypt.compare(testPassword, admin.password);
    
    console.log("\n🔐 Password Test:");
    console.log("Testing password:", testPassword);
    console.log("Match:", isValid ? "✅ YES" : "❌ NO");

    if (!isValid) {
      console.log("\n⚠️  Password doesn't match! Recreating admin...");
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testPassword, salt);
      
      admin.password = hashedPassword;
      await admin.save();
      
      console.log("✅ Admin password reset successfully!");
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkAdmin();