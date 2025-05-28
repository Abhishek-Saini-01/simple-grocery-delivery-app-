import express from "express";
import { addAddress, getAddresses } from "../controllers/address.controller.js";
import authUser from "../middlewres/authUser.middleware.js";
const addressRouter = express.Router();

addressRouter.post("/add", authUser, addAddress);
addressRouter.get("/get", authUser, getAddresses);

export default addressRouter;