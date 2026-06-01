//this app will establish server and then connect to db , int hee endd you have to showcaase it out as well 
//This file initializes your environment configuration, handles starting up the server listener, and safely boots your database connection.
require("dotenv").config()//using config method we  can express env variables all throught the express server 
const app=require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()
app.listen(3000,()=>{
    console.log("server running on port 3000")
})