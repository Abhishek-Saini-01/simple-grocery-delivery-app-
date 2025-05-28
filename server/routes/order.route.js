import express from "express";
import { getAllOrders, getOrderById, placeOrderCOD, placeOrderStripe } from "../controllers/order.controller.js";
import authUser from "../middlewres/authUser.middleware.js";
import authSeller from "../middlewres/authSeller.middleware.js";
const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.get("/user", authUser, getOrderById);
orderRouter.get("/seller", authSeller, getAllOrders);

export default orderRouter;