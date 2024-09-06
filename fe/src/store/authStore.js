import { create } from 'zustand'

import axios from 'axios'

axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => (
    {
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
        isCheckingAuth: true,
        message: null,

        signup: async (email, password, name) => {
            set({ isLoading: true, error: null });
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_SERVER_URL}/api/auth/signup`,
                    { email, password, name }
                );
                if (res.data.success) {
                    set({
                        user: res.data.user,
                        isAuthenticated: true,
                    })
                }
            } catch (error) {
                set({
                    error: error.response.data.message || "Error sign up",
                })
                throw error;
            } finally {
                set({
                    isLoading: false
                })
            }
        },
        login: async (email, password) => {
            set({ isLoading: true, error: null });
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
                    { email, password }
                );
                if (res.data.success) {
                    set({
                        user: res.data.user,
                        isAuthenticated: true,
                    })
                }
            } catch (error) {
                set({
                    error: error.response.data.message || "Error login",
                })
                throw error;
            } finally {
                set({
                    isLoading: false
                })
            }
        },
        logout: async () => {
            set({ isLoading: true, error: null });
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`,
                );
                if (res.data.success) {
                    set({
                        user: null,
                        isAuthenticated: false,
                        error: null,
                        isLoading: false,
                    })
                    return res.data
                }
            } catch (error) {
                set({
                    error: error.response.data.message || "Error logout",
                })
                throw error;
            } finally {
                set({
                    isLoading: false
                })
            }
        },
        verifyEmail: async (code) => {
            set({ isLoading: true, error: null });
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_SERVER_URL}/api/auth/verify-email`,
                    { code }
                );
                if (res.data.success) {
                    set({
                        user: res.data.user,
                        isAuthenticated: true,
                    })
                    return res.data
                }
            } catch (error) {
                set({
                    error: error.response.data.message || "Error verify email",
                })
                throw error;
            } finally {
                set({
                    isLoading: false
                })
            }
        },
        checkAuth: async () => {
            // await new Promise((resolve) => setTimeout(resolve, 2000))
            set({
                isCheckingAuth: true,
                error: null
            })
            try {
                const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/check-auth`)
                if (res.data.success) {
                    set({
                        user: res.data.user,
                        isAuthenticated: true,
                        isCheckingAuth: false,
                    })
                }
            } catch (error) {
                set({
                    error: null,
                    isAuthenticated: false,
                    isCheckingAuth: false
                })
                console.log(error);
            }
        },
        forgotPassword: async (email) => {
            set({ isLoading: true, error: null });
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_SERVER_URL}/api/auth/forgot-password`,
                    { email }
                );
                if (res.data.success) {
                    set({
                        message: res.data.message
                    })
                    return res.data
                }
            } catch (error) {
                set({
                    error: error.response.data.message || "Error forgot password",
                })
                throw error;
            } finally {
                set({
                    isLoading: false
                })
            }
        },
        resetPassword: async (token, password, confirmPassword) => {
            set({ isLoading: true, error: null });
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_SERVER_URL}/api/auth/reset-password/${token}`,
                    { password, confirmPassword }
                );
                if (res.data.success) {
                    set({
                        message: res.data.message
                    })
                    return res.data
                }
            } catch (error) {
                set({
                    error: error.response.data.message || "Error reset password",
                })
                throw error;
            } finally {
                set({
                    isLoading: false
                })
            }
        },
        resendVerifyEmail: async (email) => {
            set({ isLoading: true, error: null });
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_SERVER_URL}/api/auth/resend-verify-email`,
                    { email }
                );
                if (res.data.success) {
                    set({
                        message: res.data.message
                    })
                    return res.data
                }
            } catch (error) {
                set({
                    error: error.response.data.message || "Error resend verify email",
                })
                throw error;
            } finally {
                set({
                    isLoading: false
                })
            }
        },
    }
))