import express from "express";
import { isAuth, login, logout, register } from "../controllers/user.contoller.js";
import auth from "../middlewres/authUser.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/is-auth", auth, isAuth);
userRouter.get("/logout", auth, logout);

export default userRouter;
