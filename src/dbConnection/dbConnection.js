import mongoose from "mongoose";

export async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const connection = mongoose.connection;

        // connection event listener
        connection.on('connected', () => {
            console.log("MongoDB is Connected");
        });

        // error listener
        connection.on('error', (err) => {
            console.error("MongoDB Connection error:"+ err);
        });

        // process.exit();

    } catch (error) {
        console.error("Something went wrong in connecting to DB");
        console.error(error);
    }
}
