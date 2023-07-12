import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI!, {
            dbName: 'todo_app'
        });

        isConnected = true;

        console.log('MongoDB connected.');
    } catch (error) {
        console.log(error);
    }
}