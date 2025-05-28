import express from "express";
import { isAuth, sellerLogin, sellerLogout } from "../controllers/seller.controller.js";
import auth from "../middlewres/authSeller.middleware.js";

const sellerRouter = express.Router();

sellerRouter.post("/login", sellerLogin);
sellerRouter.get("/is-auth", auth, isAuth);
sellerRouter.get("/logout", auth, sellerLogout);

export default sellerRouter;
