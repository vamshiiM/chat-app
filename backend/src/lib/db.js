import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database connected! host: ${conn.connection.host}`);
    } catch (error) {
        console.log('MongoDb connection error:', error);
    }
}