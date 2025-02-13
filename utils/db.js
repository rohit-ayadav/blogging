import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB connected successfully');
        } else {
            // console.log('MongoDB already connected');
        }
    }
    catch (error) {
        console.error('Error connecting to MongoDB: ', error);
        process.exit(1);
    }
}

export const disconnectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('MongoDB disconnected successfully');
        } else {
            console.log('MongoDB already disconnected');
        }
    }
    catch (error) {
        console.error('Error disconnecting from MongoDB: ', error);
        process.exit(1);
    }
}