import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({
                success: false,
                message: "No token found",
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decodedToken.id, name: decodedToken.name }; // Attach to req.user
        next();
        // if (decodedToken.id) {
        //     req.body.userId = decodedToken.id;
        //     next();
        // } else {
        //     return res.json({
        //         success: false,
        //         message: "Invalid Token",
        //     });
        // }

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Unauthorized",
        });
    }
}

export default authUser;