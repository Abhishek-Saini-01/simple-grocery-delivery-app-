import jwt from "jsonwebtoken";

// seller login
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            res.cookie("sellerToken", token, {
                httpOnly: true, // Prevent Javascript to access cookies
                secure: process.env.NODE_ENV === "production", // use secure cookies in production
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
                maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time -> 7 days
            });
            return res.json({
                success: true,
                message: "Seller logged in successfully",
            });
        } else {
            return res.json({
                success: false,
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

//seller is Authenticated
export const isAuth = async (req, res) => {
    try {
        return res.json({
            success: true
        });
    } catch (error) {
        console.log(error.message);

        res.json({
            success: false,
            message: error.message,
        })
    }
}

// seller logout
export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // use secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.json({
            success: true,
            message: "Seller logged out successfully",
        });
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message,
        })
    }
}
