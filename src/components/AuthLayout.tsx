"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "./ui/Logo";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    type: "login" | "register" | "reset-password" | "forgot-password";
}

export function AuthLayout({ children, title, subtitle, type }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/20 via-transparent to-transparent" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="bg-[#121212] rounded-2xl p-8 md:p-12 shadow-xl border border-gray-800/50 backdrop-blur-xl relative z-10">
                    <div className="mb-8 text-center">
                        <Link href="/" className="inline-block mb-6">
                            <Logo />
                        </Link>
                        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            {title}
                        </h1>
                        <p className="text-gray-400">{subtitle}</p>
                    </div>

                    {children}

                    <div className="mt-6 text-center text-sm text-gray-400">
                        {type === "login" ? (
                            <>
                                Don't have an account?{" "}
                                <Link href="/register" className="text-[#8B5CF6] hover:text-[#8B5CF6]/80 font-medium">
                                    Sign up
                                </Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <Link href="/login" className="text-[#8B5CF6] hover:text-[#8B5CF6]/80 font-medium">
                                    Sign in
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}