//all things related  to authentication happen in here 
//we need express , rathhr directly acquire router 
// we will just make api here 
//Creates explicit API endpoints and links them directly to the controller brains.
const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware= require("../middlewares/auth.middleware")
const authRouter = Router();
// Route path: /api/v1/auth/register (depending on your prefix in app.js)
authRouter.post("/register", authController.registerUserController);
authRouter.post("/login", authController.loginUserController);
//now we have created both register and login apis

//now start with logout  apis
authRouter.get("/logout", authController.logoutUserController);

//middleware ki api 
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)
module.exports = authRouter;