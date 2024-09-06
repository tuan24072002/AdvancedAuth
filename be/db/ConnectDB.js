import mongoose from "mongoose"

const ConnectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (error) {
        console.log("Error connection to MongoDB: ", error.message);
        process.exit(1); // 1 is failure, 0 status code is success
    }
}

export default ConnectDB