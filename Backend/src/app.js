//Orchestrates all central middleware applications. It injects JSON parsers, cookie readers, sets global base paths (like /api/auth), and exports the clean configuration to the server runner.
const express = require("express")
const cookieParser = require("cookie-parser") // Injected cookie reader package

const app=express()//initialise app

app.use(express.json())//lets us read data in fetch,request format 
app.use(cookieParser())//middleware to read cookie tokens from req.cookies

//require all routes from here 
const authRouter = require("./routes/auth.routes")
app.use("/api/auth",authRouter)


module.exports = app