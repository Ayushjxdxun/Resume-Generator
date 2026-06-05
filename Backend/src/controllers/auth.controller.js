//Processes user requests. It intercepts inputs from the front-end, validates that the format is full, searches the database to prevent duplicate sign-ups, hashes the plain-text passwords securely using bcryptjs, issues JWT authentication tokens, and bakes them straight into browser cookies.
const userModel = require("../models/user.models");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
// Change this line to look exactly like this:
const tokenBlacklistModel = require("../models/blacklist.model");
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;

        // 1. Validation: Check if any fields are missing
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        // 2. Process registration logic here 
        // (e.g., checking if user exists, hashing password, saving to DB)
        const isUserAlreadyExists = await userModel.findOne({
            $or: [ { username }, { email } ]
        });

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already exists with this email address or username"
            });
        }
        // just hash the plain text password for safety
        const hash = await bcrypt.hash(password, 10);

        // here create and save the new user in the database with the hashed password
        const user = await userModel.create({
            username,
            email,
            password: hash
        });

        //generate a JWT Token for session authentication
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || "fallback_secret_key", // Uses env secret key
            { expiresIn: "1d" }
        );

        // Set the token inside an HTTP cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" 
        });
        //  Send back a response confirming registration success
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });


    } catch (error) {
        console.error("Error in registration controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
/**
 * @name loginUserController
 * @description authenticates user with email & password, verifies hash, and returns a JWT cookie
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        // 1. Validation: Ensure both fields are filled out
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide both email and password"
            });
        }

        // 2. Locate the user in the database by their email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // 3. Compare the typed password with the securely hashed database password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // 4. Create a JWT session token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || "fallback_secret_key",
            { expiresIn: "1d" }
        );

        // 5. Store the JWT token securely in an HTTP-only browser cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" 
        });
        // 6. Return response to client with a status 200 (OK)
        res.status(200).json({
            message: "User loggedIn successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Error in login controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
// Exporting as an object so you can easily add loginUserController later!
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token;

        if (token) {
            // Inserts the cookie token directly into your blacklist collection
            await tokenBlacklistModel.create({ token });
        }

        // Wipe the token cookie from the client browser session
        res.clearCookie("token");

        return res.status(200).json({
            message: "User logged out successfully"
        });

    } catch (error) {
        console.error("Error in logout controller:", error);
        return res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
}
async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id)


    res.status(200).json({
        message: "User details fetched successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};