"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { Clock, Percent, X, AlertCircle } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })
import type { ApexOptions } from "apexcharts"

interface TradingBot {
    id: number
    name: string
    description: string
    min_roi: number
    max_roi: number
    duration_days: number
    price_amount: number
    price_currency: string
}

interface TradingSession {
    id: number
    bot_id: number
    bot_name: string
    initial_amount: number
    currency: string
    start_date: string
    end_date: string
    status: string
    current_profit: number
    trading_data_url: string
}

export default function AITradingPage() {
    const router = useRouter()
    const [showBuyModal, setShowBuyModal] = useState(false)
    const [selectedBot, setSelectedBot] = useState<TradingBot | null>(null)
    const [amount, setAmount] = useState("")
    const [availableBots, setAvailableBots] = useState<TradingBot[]>([])
    const [runningSessions, setRunningSessions] = useState<TradingSession[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [totalProfit, setTotalProfit] = useState(0)
    const [totalInvested, setTotalInvested] = useState(0)

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds
        return () => clearInterval(interval)
    }, [])

    const fetchData = async () => {
        try {
            const [botsRes, sessionsRes] = await Promise.all([
                fetch('/api/trading/bots', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('auth-token')}`
                    }
                }),
                fetch('/api/trading/sessions', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('auth-token')}`
                    }
                })
            ])
            
            const botsData = await botsRes.json()
            const sessionsData = await sessionsRes.json()

            console.log(botsData)
            if (botsData.bots) {
                setAvailableBots(botsData.bots)
            }
            
            if (sessionsData.sessions) {
                setRunningSessions(sessionsData.sessions)
                calculateTotals(sessionsData.sessions)
            }
        } catch (error) {
            console.error('Failed to fetch data:', error)
            setError("Failed to load trading data")
        } finally {
            setIsLoading(false)
        }
    }

    const calculateTotals = (sessions: TradingSession[]) => {
        let profit = 0
        let invested = 0
        
        sessions.forEach(session => {
            profit += session.current_profit
            invested += session.initial_amount
        })
        
        setTotalProfit(profit)
        setTotalInvested(invested)
    }

    const handleBotPurchase = async () => {
        if (!selectedBot || !amount) return
        
        try {
            const response = await fetch('/api/trading/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('auth-token')}`
                },
                body: JSON.stringify({
                    botId: selectedBot.id,
                    amount: parseFloat(amount),
                    currency: 'USD'  // Changed to always use USD
                })
            })

            const data = await response.json()
            if (data.success) {
                fetchData()
                setShowBuyModal(false)
                setSelectedBot(null)
                setAmount("")
            } else {
                throw new Error(data.error || "Failed to start trading")
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to start trading")
        }
    }

    const chartOptions: ApexOptions = {
        chart: {
            type: "line",
            height: 300,
            toolbar: { show: false },
            background: "transparent",
        },
        theme: { mode: "dark" },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        xaxis: {
            type: "datetime",
            labels: {
                style: { colors: "#fff" },
            }
        },
        yaxis: {
            labels: {
                style: { colors: "#fff" },
                formatter: (value) => `$${value.toFixed(2)}`
            }
        },
        grid: { borderColor: "#ffffff1a" },
        colors: ["#26a69a"]
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white pb-[5rem]">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                    <TopBar title="AI Trading" />
                    <div className="p-4 lg:p-8">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6 flex items-center gap-2">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        {/* Balance Cards */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-[#121212] rounded-[1rem] p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Total Invested</h2>
                                </div>
                                <div className="text-3xl font-bold mb-2">
                                    ${totalInvested.toFixed(2)}
                                </div>
                            </div>

                            <div className="bg-[#121212] rounded-[1rem] p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Total Profit</h2>
                                    <span className={totalProfit >= 0 ? "text-green-500" : "text-red-500"}>
                                        {totalProfit >= 0 ? "+" : ""}{totalProfit.toFixed(2)}%
                                    </span>
                                </div>
                                <div className="text-3xl font-bold mb-2">
                                    ${(totalInvested * (1 + totalProfit / 100)).toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => setShowBuyModal(true)}
                                className="bg-orange-500 hover:bg-orange-600 py-3 px-4 rounded-lg font-medium"
                            >
                                Buy Trading Bot
                            </button>
                            <Link
                                href="/dashboard/Aitrading/history"
                                className="bg-[#121212] hover:bg-[#1A1A1A] py-3 px-4 rounded-lg font-medium text-center"
                            >
                                Trading History
                            </Link>
                        </div>

                        {/* Running Sessions */}
                        <div className="bg-[#121212] rounded-[1rem] p-6 mb-6">
                            <h3 className="text-xl font-semibold mb-4">Active Trading Sessions</h3>
                            <div className="space-y-4">
                                {runningSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        onClick={() => router.push(`/dashboard/Aitrading/${session.id}`)}
                                        className="bg-[#1A1A1A] p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#242424] transition-colors"
                                    >
                                        <div>
                                            <div className="font-medium">{session.bot_name}</div>
                                            <div className="text-sm text-gray-400 flex items-center gap-2">
                                                <Clock size={14} />
                                                {new Date(session.end_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className={`text-lg ${session.current_profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {session.current_profit >= 0 ? "+" : ""}{session.current_profit}%
                                        </div>
                                    </div>
                                ))}
                                {runningSessions.length === 0 && (
                                    <div className="text-gray-400 text-center py-4">
                                        No active trading sessions
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase Modal */}
            {showBuyModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#121212] rounded-[1rem] p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Purchase Trading Bot</h3>
                            <button
                                onClick={() => setShowBuyModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Select Bot
                                </label>
                                <select
                                    className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 text-white"
                                    onChange={(e) => {
                                        const bot = availableBots.find(b => b.id === parseInt(e.target.value))
                                        setSelectedBot(bot || null)
                                    }}
                                    value={selectedBot?.id || ""}
                                >
                                    <option value="">Select a bot</option>
                                    {availableBots.map((bot) => (
                                        <option key={bot.id} value={bot.id}>
                                            {bot.name} - {bot.price_amount} {bot.price_currency}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedBot && (
                                <>
                                    <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                        <div className="text-sm text-gray-400 mb-2">Expected ROI</div>
                                        <div className="text-green-500 font-medium">
                                            {selectedBot.min_roi}% - {selectedBot.max_roi}%
                                        </div>
                                        <div className="text-sm text-gray-400 mt-2">Duration</div>
                                        <div>{selectedBot.duration_days} days</div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                            Investment Amount (USD)
                                        </label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 text-white"
                                            placeholder={`Min: $${selectedBot.price_amount}`}
                                            min={selectedBot.price_amount}
                                            step="0.01"
                                        />
                                    </div>
                                </>
                            )}

                            <button
                                onClick={handleBotPurchase}
                                disabled={!selectedBot || !amount || parseFloat(amount) < selectedBot?.price_amount}
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed py-3 rounded-lg font-medium mt-4"
                            >
                                Start Trading
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}