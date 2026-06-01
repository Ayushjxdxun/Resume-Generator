//here  we will determine what will be the schema of a user login , we need name email password 
//Defines what a user look like inside the MongoDB collection. Enforces built-in validations (like lowercasing and trimming out whitespace spaces) so messy input data doesn't corrupt your storage.
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: [true, "username already taken"],
            required: [true, "username is required"],

        },
        email: {
            type: String,
            unique: [true, "Account already exists with this email address"],
            required: [true, "Email address is required"],

        },
        password: {
            type: String,
            required: [true, "Password is required"],//not needed to be unique
            minlength: [6, "Password must be at least 6 characters long"],
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields VERYYY IMP
    }
);

// Create the model using the schema
const userModel = mongoose.model("users", userSchema);

// Export karrdo model so it can be used 
module.exports = userModel;