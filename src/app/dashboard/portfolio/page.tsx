"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Eye, EyeOff, Filter } from "lucide-react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import Link from "next/link"
import dynamic from "next/dynamic"


const portfolioData = [
    {
        name: "Bitcoin",
        symbol: "BTC",
        amount: "2.5384",
        value: 89432.54,
        change: 2.5,
        icon: "₿",
        iconBg: "bg-orange-500/20",
        iconColor: "text-orange-500",
        allocation: 45.2,
    },
    {
        name: "Ethereum",
        symbol: "ETH",
        amount: "15.4392",
        value: 43219.32,
        change: -1.2,
        icon: "Ξ",
        iconBg: "bg-purple-500/20",
        iconColor: "text-purple-500",
        allocation: 28.4,
    },
    {
        name: "Cardano",
        symbol: "ADA",
        amount: "10432.43",
        value: 12453.21,
        change: 5.6,
        icon: "◎",
        iconBg: "bg-blue-500/20",
        iconColor: "text-blue-500",
        allocation: 15.3,
    },
    {
        name: "Solana",
        symbol: "SOL",
        amount: "154.32",
        value: 8765.43,
        change: -0.8,
        icon: "◎",
        iconBg: "bg-green-500/20",
        iconColor: "text-green-500",
        allocation: 11.1,
    },
]

const generateChartData = () => {
    const dates = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        return date.getTime()
    })

    return dates.map(date => ({
        x: date,
        y: Math.floor(Math.random() * 50000) + 150000
    }))
}

export default function PortfolioPage() {
    const [showBalance, setShowBalance] = useState(true)


    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                    <TopBar title="Portfolio" />
                    <div className="flex flex-col lg:flex-row">
                        {/* Main Content */}
                        <div className="flex-1 w-full lg:max-w-[calc(100%-320px)] p-4 lg:p-8">
                            {/* Portfolio Value Card */}
                            <div className="bg-[#121212] flex flex-col lg:flex-row justify-between px-4 lg:px-[1.5rem] rounded-[1rem] py-4 lg:py-[1.5rem] mb-8">
                                <div className="flex flex-col gap-2">
                                    <div className="text-sm text-gray-400">Total Portfolio Value</div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-4xl font-bold tracking-tight">
                                            {showBalance ? "$ 153,870.50" : "$ ••••••••••"}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-500">
                                        <ArrowUp className="h-4 w-4" />
                                        <span>2.5% ($3,842.25)</span>
                                    </div>

                                    {/* Quick Action Buttons - Mobile Only */}
                                    <div className="flex gap-2 mt-4 lg:hidden">
                                        <button className="flex-1 rounded-lg bg-orange-500 py-2 text-sm font-medium">
                                            Send
                                        </button>
                                        <button className="flex-1 rounded-lg bg-[#121212] border border-gray-800 py-2 text-sm font-medium">
                                            Receive
                                        </button>
                                        <button className="flex-1 rounded-lg bg-[#121212] border border-gray-800 py-2 text-sm font-medium">
                                            Swap
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <button className="rounded-full bg-white/20 p-3 hover:bg-gray-700/50" onClick={() => setShowBalance(!showBalance)}>
                                        {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Assets List with Headers */}
                            <div>
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="text-lg font-medium">Assets</div>
                                    <button className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-400">
                                        <Filter className="h-4 w-4" />
                                        Filter
                                    </button>
                                </div>

                                {/* Table Headers */}
                                <div className="hidden md:grid grid-cols-4 gap-4 px-4 py-2 text-sm text-gray-400">
                                    <div>Asset</div>
                                    <div className="text-right">Balance</div>
                                    <div className="text-right">Price</div>
                                    <div className="text-right">Allocation</div>
                                </div>

                                <div className="space-y-2">
                                    {portfolioData.map((asset) => (
                                        <Link
                                            href={`/dashboard/portfolio/${asset.symbol.toLowerCase()}`}
                                            key={asset.name}
                                            className="flex items-center justify-between rounded-lg bg-[#121212] p-4 hover:bg-[#1A1A1A] transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`rounded-lg ${asset.iconBg} p-2`}>
                                                    <span className={`text-lg ${asset.iconColor}`}>{asset.icon}</span>
                                                </div>
                                                <div>
                                                    <div className="font-medium">{asset.name}</div>
                                                    <div className="text-sm text-gray-400">{asset.amount} {asset.symbol}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">${asset.value.toLocaleString()}</div>
                                                <div className={`flex items-center justify-end gap-1 text-sm ${asset.change >= 0 ? "text-green-500" : "text-red-500"
                                                    }`}>
                                                    {asset.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                                    {Math.abs(asset.change)}%
                                                </div>
                                            </div>
                                            <div className="hidden md:block text-right">
                                                <div className="font-medium">{asset.allocation}%</div>
                                                <div className="text-sm text-gray-400">Allocation</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Analytics */}
                        <div className="w-full lg:w-80 border-t lg:border-l border-gray-800/50 p-4 lg:p-5">
                            <div className="mb-6">
                                <div className="mb-4 text-lg font-medium">Portfolio Analytics</div>
                                <div className="space-y-4">
                                    <div className="rounded-lg bg-[#121212] p-4">
                                        <div className="text-sm text-gray-400">Risk Level</div>
                                        <div className="mt-1 text-lg font-medium">Moderate</div>
                                        <div className="mt-2 h-2 rounded-full bg-gray-800">
                                            <div className="h-full w-[65%] rounded-full bg-orange-500"></div>
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-[#121212] p-4">
                                        <div className="text-sm text-gray-400">Diversification Score</div>
                                        <div className="mt-1 text-lg font-medium">7.5/10</div>
                                        <div className="mt-2 h-2 rounded-full bg-gray-800">
                                            <div className="h-full w-[75%] rounded-full bg-green-500"></div>
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-[#121212] p-4">
                                        <div className="text-sm text-gray-400">Monthly Profit/Loss</div>
                                        <div className="mt-1 text-lg font-medium text-green-500">+$2,345.32</div>
                                        <div className="text-sm text-gray-400">Last 30 days</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="mb-4 text-lg font-medium">Quick Actions</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="rounded-lg bg-orange-500 py-3 text-sm font-medium transition-colors hover:bg-orange-600">
                                        Buy Crypto
                                    </button>
                                    <button className="rounded-lg bg-[#121212] py-3 text-sm font-medium transition-colors hover:bg-[#1A1A1A]">
                                        Sell Crypto
                                    </button>
                                    <button className="rounded-lg bg-[#121212] py-3 text-sm font-medium transition-colors hover:bg-[#1A1A1A]">
                                        Send
                                    </button>
                                    <button className="rounded-lg bg-[#121212] py-3 text-sm font-medium transition-colors hover:bg-[#1A1A1A]">
                                        Receive
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}