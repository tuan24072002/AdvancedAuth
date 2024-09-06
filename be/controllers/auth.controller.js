import userModel from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
    sendPasswordResetEmail,
    sendResetSuccessEmail,
    sendVerificationEmail,
    sendWelcomeEmail
} from "../nodemailer/send.email.js";

export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error(`All fields are required`);
        }

        const userAlreadyExist = await userModel.findOne({ email });
        if (userAlreadyExist) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt)
        //Random generate 6 digits as verification code
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new userModel({
            email,
            password: hashPassword,
            name,
            verificationToken,
            verificationExpiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
        })
        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id)

        //Send email
        await sendVerificationEmail(user.email, user.name, verificationToken);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log(`Error in signup: `, error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            })
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Password is wrong'
            })
        }
        generateTokenAndSetCookie(res, user._id)
        user.lastLogin = new Date()
        await user.save()
        return res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log(`Error in login: `, error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const logout = async (req, res) => {
    res.clearCookie('token')
    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
}
export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        if (!code) {
            throw new Error(`All fields are required`);
        }
        const user = await userModel.findOne({
            verificationToken: code,
            verificationExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification code'
            })
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.name);
        res.status(201).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log(`Error in verify email: `, error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            })
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetExpiresAt;
        await user.save()

        //send mail
        const linkResetPassword = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        await sendPasswordResetEmail(email, user.name, linkResetPassword)

        return res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email',
        });
    } catch (error) {
        console.log(`Error in forgot password: `, error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    try {
        if (!token || !password || !confirmPassword) {
            throw new Error(`All fields are required`);
        }
        if (confirmPassword !== password) {
            return res.status(400).json({
                success: false,
                message: 'Confirm password does not match'
            })
        }
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            })
        }

        //Update password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);
        user.password = hashPassword;
        user.resetPasswordExpiresAt = undefined;
        user.resetPasswordToken = undefined;
        await user.save()
        await sendResetSuccessEmail(user.email, user.name);
        return res.status(200).json({
            success: true,
            message: 'Password reset successfully, redirecting to login page...',
        });
    } catch (error) {
        console.log(`Error in reset password: `, error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const checkAuth = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select(`-password`)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            })
        }
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {

    }
}
export const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            throw new Error(`All fields are required`);
        }
        //Random generate 6 digits as verification code
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await userModel.findOne({ email })
        user.verificationToken = verificationToken;
        user.verificationExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();
        await sendVerificationEmail(user.email, user.name, verificationToken);
        return res.status(201).json({
            success: true,
            message: 'Code sent to your email',
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log(`Error in resend verify email: `, error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}