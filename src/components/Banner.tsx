"use client"

import { useState } from "react"
import { Linkedin, Facebook, Instagram, Twitter, Bitcoin, DollarSign } from "lucide-react"

const cryptoOptions = [
    { value: "BTC", label: "Bitcoin", icon: Bitcoin, color: "#f7931a" },
    { value: "USDT", label: "Tether", icon: DollarSign, color: "#26a17b" },
]

export function Banner() {
    const [sentAmount, setSentAmount] = useState("0.025")
    const [getAmount, setGetAmount] = useState("2.3612")

    return (
        <div className="bg-[#000] text-white   relative overflow-hidden pt-[5rem] md:pt-24">
            {/* Background Effects */}
            <div className="absolute top-20 right-20 w-36 md:w-72 h-36 md:h-72 bg-[#f7931a]/20 rounded-full blur-[60px] md:blur-[120px]" />
            <div className="absolute top-40 left-20 w-36 md:w-72 h-36 md:h-72 bg-purple-500/20 rounded-full blur-[60px] md:blur-[120px]" />
            <div className="absolute -top-10 right-[20%] w-4 h-4 md:w-6 md:h-6 text-[#f7931a]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M2 20L22 4M2 4l20 16" strokeWidth="2" />
                </svg>
            </div>
            <div className="absolute top-40 right-[10%] w-6 h-6 md:w-8 md:h-8 text-[#f7931a]">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="8" />
                </svg>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16 relative">
                {/* Social Links */}
                <div className="hidden md:grid fixed left-4 md:left-8 top-1/2 -translate-y-1/2 space-y-4 md:space-y-8 z-10">
                    <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                        <Linkedin size={20} />
                    </a>
                    <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                        <Facebook size={20} />
                    </a>
                    <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                        <Instagram size={20} />
                    </a>
                    <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                        <Twitter size={20} />
                    </a>
                </div>

                {/* Main Content */}
                <div className="text-center mb-12 md:mb-24 relative">

                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-6">
                        Exchange your
                        <br />
                        cryptocurrency here
                        <br />
                        safely
                    </h1>
                    <button className="relative px-6 md:px-8 py-2 group">
                        <span className="absolute inset-0">
                            <svg width="100%" height="100%" viewBox="0 0 200 50" fill="none">
                                <path d="M 0,25 H 200" stroke="#f7931a" strokeWidth="1" strokeDasharray="3 3" />
                                <path d="M 25,0 V 50" stroke="#f7931a" strokeWidth="1" strokeDasharray="3 3" />
                                <path d="M 175,0 V 50" stroke="#f7931a" strokeWidth="1" strokeDasharray="3 3" />
                            </svg>
                        </span>
                        <span className="relative text-[#f7931a] group-hover:text-white z-10 px-4">Register</span>
                        <span className="absolute inset-0 scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out bg-[#f7931a] rounded-sm"></span>
                    </button>

                    {/* Exchange Form */}
                    <div className="relative overflow-hidden max-w-4xl mx-auto backdrop-blur-xl bg-[#121212]/30 md:bg-[#121212]/80 mt-[3rem] md:mt-[2rem] p-4 md:p-8 rounded-none ">
                        <div className="absolute top-40 left-50 w-80 md:w-80 h-36 md:h-72 bg-[#8B5CF6]/20 rounded-full blur-[60px] md:blur-[120px]" />

                        <div className="grid grid-cols-1 md:grid-cols-2 relative gap-8 md:gap-0">
                            {/* Send */}
                            <div className="p-4 md:p-6 md:border-r border-gray-700/50">

                                <div className="bg-[#000] p-4 rounded-none mb-4">
                                    <p className="text-gray-400 mb-2 text-sm md:text-base">Sent Amount</p>
                                    <div className="flex items-center justify-between border-b border-[#fff] pb-2 mb-4">
                                        <select
                                            className="w-full bg-transparent text-white outline-none cursor-pointer"
                                            onChange={(e) => {
                                                // Handle currency change
                                                // const selected = cryptoOptions.find((opt) => opt.value === e.target.value)
                                               
                                            }}
                                        >
                                            {cryptoOptions.map((option) => (
                                                <option key={option.value} value={option.value} className="bg-[#1a1a1a]">
                                                    {option.value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Bitcoin className="w-5 h-5 md:w-6 md:h-6 text-[#8B5CF6]" />
                                        <span className="font-bold text-sm md:text-base">BITCOIN</span>
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        value={sentAmount}
                                        onChange={(e) => {
                                            setSentAmount(e.target.value)
                                            const rate = 94.448
                                            setGetAmount((Number.parseFloat(e.target.value) * rate).toFixed(4))
                                        }}
                                        className="bg-transparent text-xl md:text-2xl font-bold w-full outline-none"
                                        placeholder="0.00"
                                        step="0.0001"
                                        min="0"
                                    />
                                    {/* <p className="text-xs md:text-sm text-gray-500 mt-1">≈ $30,000.00 USD</p> */}
                                </div>
                            </div>
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-10">
                                <div className="relative flex items-center justify-center">
                                    <hr className="md:hidden absolute w-full border-[0.5px] border-[#8B5CF6]" />
                                    <button className="relative z-10 w-10 h-10 md:w-12 md:h-12 bg-[#8B5CF6] rounded-full flex items-center justify-center transform transition-transform hover:rotate-180 shadow-lg">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M7 10h10l-3-3m0 10l3-3H7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Receive */}
                            <div className="p-4 md:p-6 md:border-l border-gray-700/50">
                                <div className="bg-[#000] p-4 rounded-none mb-4">
                                    <p className="text-gray-400 mb-2 text-sm md:text-base">Get Amount</p>

                                    <div className="flex items-center justify-between border-b border-[#fff] pb-2 mb-4">
                                        <select className="w-full bg-transparent text-white outline-none cursor-pointer">
                                            <option value="ETH" className="bg-[#1a1a1a]">
                                                ETH
                                            </option>
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <img src="/ethereum.svg" alt="Ethereum" className="w-5 h-5 md:w-6 md:h-6" />
                                        <span className="font-bold text-sm md:text-base">ETHEREUM</span>
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        value={getAmount}
                                        readOnly
                                        className="bg-transparent text-xl md:text-2xl font-bold w-full outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

