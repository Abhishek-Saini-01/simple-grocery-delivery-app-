import { Address } from "../models/address.modal.js";

export const addAddress = async (req, res) => {
    try {
        const { address } = req.body;
        await Address.create({ userId: req.user.id, ...address });
        return res.json({
            success: true,
            message: "Address added successfully",
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

export const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ userId: req.user.id });
        return res.json({
            success: true,
            addresses,
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message,
        })
    }
}
