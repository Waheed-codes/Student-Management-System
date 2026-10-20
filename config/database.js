import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

async function connectDB() {
    try {
        const db_uri = process.env.MONGODB_URI
        await mongoose.connect(db_uri)
        console.log("Database Connected Successfully")
    } catch (error) {
        console.error(error.message)
    }

}
connectDB()