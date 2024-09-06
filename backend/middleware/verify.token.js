import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
    const token = req?.cookies?.token
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized - no token provided'
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({
                success: false,
                message: 'Unauthorized - Invalid token'
            })
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(`Error in verify token: `, error.message);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}