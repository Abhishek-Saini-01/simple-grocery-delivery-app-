import express from "express";
import { addProduct, changeStock, productById, productlist } from "../controllers/product.controller.js";
import { upload } from "../configs/multer.js";
import authSeller from "../middlewres/authSeller.middleware.js";
const productRouter = express.Router();

productRouter.post("/add", upload.array(["images"]), authSeller, addProduct);
productRouter.get("/list", productlist);
productRouter.get("/id", productById);
productRouter.post("/stock", authSeller, changeStock);

export default productRouter;
