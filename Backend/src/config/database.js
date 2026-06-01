const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        // .trim() removes any accidential invisible spaces or newline characters
        const dbURI = process.env.MONGO_URI ? process.env.MONGO_URI.trim() : null;
        
        if (!dbURI) {
            throw new Error("MONGO_URI is missing or undefined in environment configuration.");
        }

        await mongoose.connect(dbURI);
        console.log("connected to db");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectToDB;