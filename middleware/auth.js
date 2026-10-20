import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if(!token)
        {
            return res.status(401).json({message: "No token passed"});
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        req.user = decode;
        next();
    } catch (error) {
        console.error(error.message);
    }
}

export default authMiddleware;