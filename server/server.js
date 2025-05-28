import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import connectDB from "./configs/db.js";
import userRouter from "./routes/user.route.js";
import sellerRouter from "./routes/seller.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import addressRouter from "./routes/address.route.js";
import connectToCloudinary from "./configs/cloudinary.js";
import orderRouter from "./routes/order.route.js";
import { stripeWebhook } from "./controllers/order.controller.js";

const app = express();
const PORT = process.env.PORT || 4000;

await connectDB();
await connectToCloudinary();
// Allow multiple origins
const allowedOrigins = [
  "https://simple-grocery-delivery-app-fronten-fawn.vercel.app",
  "http://localhost:5173",
];

app.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

//User Routes
app.use("/api/user", userRouter);

//Seller Routes
app.use("/api/seller", sellerRouter);

//Product Routes
app.use("/api/product", productRouter);

//Cart Routes
app.use("/api/cart", cartRouter);

//Address Routes
app.use("/api/address", addressRouter);

//Order Routes
app.use("/api/order", orderRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
