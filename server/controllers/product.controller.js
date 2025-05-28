import { v2 as cloudinary } from "cloudinary";
import { Product } from "../models/product.modal.js";
//add product
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);
        if (!productData) {
            return res.json({
                success: false,
                message: "Missing Details",
            });
        }
        const images = req.files;
        let imageUrl = await Promise.all(images.map(async (image) => {
            let result = await cloudinary.uploader.upload(image.path, {
                resource_type: "image",
            });
            return result.secure_url;
        }));
        await Product.create({
            ...productData,
            image: imageUrl,
        });
        return res.json({
            success: true,
            message: "Product added successfully",
        });
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

//product list
export const productlist = async (req, res) => {
    try {
        const products = await Product.find({});
        return res.json({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

// product by Id -> single product
export const productById = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        return res.json({
            success: true,
            product,
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

// change stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        const product = await Product.findByIdAndUpdate(id, { inStock });
        if (!product) {
            return res.json({
                success: false,
                message: "Product not found",
            })
        }

        return res.json({
            success: true,
            message: "Stock changed successfully",
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

