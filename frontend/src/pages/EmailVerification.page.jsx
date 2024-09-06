import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader, RotateCcw } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast } from 'react-hot-toast'
const EmailVerificationPage = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRef = useRef([]);
    const navigate = useNavigate();
    const { verifyEmail, error, isLoading, resendVerifyEmail, user, logout } = useAuthStore();

    const handleResendVerifyEmail = async () => {
        try {
            const res = await resendVerifyEmail(user?.email)
            toast.success(res.message)
        } catch (error) {
            console.log(error);
        }
    }
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        try {
            const res = await verifyEmail(verificationCode);
            if (res) {
                navigate('/')
                toast.success(res.message)
            }
        } catch (error) {
            console.log(error);
        }
    }, [code, navigate, verifyEmail])
    const handleChange = (index, value) => {
        const newCode = [...code];
        //handle paste coode
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split('')
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || ""
            }
            setCode(newCode)

            //Focus on the last non-empty input or the first empty one
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== '');
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRef.current[focusIndex].focus();
        } else {
            newCode[index] = value;
            setCode(newCode)

            if (value && index < 5) {
                inputRef.current[index + 1].focus();
            }
        }
    }
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRef.current[index - 1].focus();
        }
    }

    //Auto submit when all fields are filled
    useEffect(() => {
        if (code.every((digit) => digit !== '')) {
            handleSubmit(new Event('submit'));
        }
    }, [code, handleSubmit])

    const handleLogout = async () => {
        try {
            const res = await logout()
            toast.success(res.message)
            navigate('/login')
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <div
                className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
            >
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
                >
                    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                        Verify Your Email
                    </h2>
                    <p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your email address.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex-between">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRef.current[index] = el)}
                                    type='text'
                                    maxLength='6'
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
                                />
                            ))}
                        </div>
                        <div className="flex-between">
                            {
                                error && <p className="text-red-500 font-semibold mt-2 text-sm">
                                    {error}
                                </p>
                            }
                            <p className="text-white hover:underline flex items-center gap-2 cursor-pointer" onClick={handleResendVerifyEmail}>Resend code <RotateCcw size={18} /></p>
                        </div>
                        <motion.button
                            className="mt-5 w-full py-3 px-4 bg-gradient-to-r  from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                        >
                            {
                                isLoading ? <Loader className="size-6 animate-spin mx-auto" /> : "Verify Email"
                            }
                        </motion.button>
                        <motion.button
                            className="mt-5 w-full py-3 px-4 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                        >
                            Logout
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </>
    )
}

export default EmailVerificationPage