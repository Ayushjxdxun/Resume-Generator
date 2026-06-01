//verify a json token ,authuser is a middleware to know which user requested 
const jwt = require("jsonwebtoken");
const tokenBlacklistModel=require("../models/blacklist.model")


async function authUser(req, res, next) {
    // 1. Automatically extract the token from cookies
    const token = req.cookies.token;

    // 2. If the cookie doesn't exist, block the request immediately
    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        });
    }
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
    token
    })

     if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    try {
        // 3. Verify the token using your JWT Secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
        
        // 4. Attach the decoded payload info (like user id) to the request object
        req.user = decoded;

        // 5. Pass control to the next function (the controller)
        next();

    } catch (err) {
        // 6. If token is expired or altered, return an error
        return res.status(401).json({
            message: "Invalid token."
        });
    }
}

// Exporting as an object just like the video setup (image_a3f12f.png line 32)
module.exports = {
    authUser
};