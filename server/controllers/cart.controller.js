import { User } from "../models/user.modal.js";

//update cart data
export const updateCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        if (!cartItems) {
            return res.json({
                success: false,
                message: "Missing Details",
            })
        }
        await User.findByIdAndUpdate(req.user.id, { cartItems });

        return res.json({
            success: true,
            message: "Cart updated successfully",
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message,
        })
    }
}