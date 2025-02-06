"use client"

import { motion } from "framer-motion"
import { Shield, ArrowLeftRight, TrendingUp, Award } from "lucide-react"
import Image from "next/image"

export function Features() {
    return (
        <div className="bg-black text-white pb-[5rem] relative">
            <div className="absolute top-20 right-20 w-full md:w-72 h-36 md:h-72 bg-purple-500/20 rounded-full blur-[60px] md:blur-[120px]" />
            <div className=" max-w-2xl mx-auto px-4 ">
                <h2 className="text-[#f7931a] mb-4 text-lg md:text-xl">Exchange platform</h2>
                <h3 className="text-2xl md:text-4xl font-bold mb-6">Most Trusted and Secure Exchange platform</h3>
                <p className="text-gray-400 mb-4 text-sm md:text-base">
                    Centralized cryptocurrency exchanges act as an intermediary between a buyer and a seller and make.
                </p>
                <p className="text-gray-400 mb-8 text-sm md:text-base">Money through commissions and transaction fees</p>
                <button className="relative px-6 md:px-8 py-2 group">
                    <span className="absolute inset-0">
                        <svg width="100%" height="100%" viewBox="0 0 200 50" fill="none">
                            <path d="M 0,25 H 200" stroke="#f7931a" strokeWidth="1" strokeDasharray="3 3" />
                            <path d="M 25,0 V 50" stroke="#f7931a" strokeWidth="1" strokeDasharray="3 3" />
                            <path d="M 175,0 V 50" stroke="#f7931a" strokeWidth="1" strokeDasharray="3 3" />
                        </svg>
                    </span>
                    <span className="relative text-[#f7931a] group-hover:text-white z-10 px-4">Explore more</span>
                    <span className="absolute inset-0 scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out bg-[#f7931a] rounded-sm"></span>
                </button>
            </div>
            <div className="container mx-auto px-4 py-8 md:py-16 relative">

                <div className="text-center mb-12 md:mb-24 relative">

                    <div className="mt-16 md:mt-32">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {[
                                { icon: Shield, title: "Secure Transaction" },
                                { icon: ArrowLeftRight, title: "Simple way Transfer" },
                                { icon: TrendingUp, title: "Save Trading" },
                                { icon: Shield, title: "Trusted platform" },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="text-center backdrop-blur-sm bg-[#121212]/20 p-4  md:px-6 py-[2rem] rounded-[1rem] border border-gray-800/50 relative overflow-hidden"
                                >
                                    <div className="absolute top-40 left-50 w-80 md:w-80 h-36 md:h-72 bg-[#8B5CF6]/10 rounded-full blur-[150px] md:blur-[120px]" />

                                    <div className="bg-[#2a2a2a] w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-[#f7931a]" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm md:text-base">
                                        A secured transaction is a transaction in which a security interest is created.
                                    </p>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

