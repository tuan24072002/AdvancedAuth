import express from "express";
import {
    login,
    logout,
    signup,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuth,
    resendVerifyEmail,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verify.token.js";

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.get(`/check-auth`, verifyToken, checkAuth)
router.post(`/resend-verify-email`, resendVerifyEmail)
export default router;