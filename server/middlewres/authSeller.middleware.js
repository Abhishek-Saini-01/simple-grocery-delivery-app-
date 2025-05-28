import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
    try {
        const { sellerToken } = await req.cookies;
        if (!sellerToken) {
            return res.json({
                success: false,
                message: "Unauthorized",
            });
        }

        const decodedToken = await jwt.verify(sellerToken, process.env.JWT_SECRET);
        if (decodedToken.email === process.env.SELLER_EMAIL) {
            next();
        } else {
            return res.json({
                success: false,
                message: "Unauthorized",
            });
        }
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Unauthorized",
        });
    }
}

export default authSeller;