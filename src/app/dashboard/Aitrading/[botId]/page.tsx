"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { Clock, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })
import type { ApexOptions } from "apexcharts"

const trades = [
    { time: "10:45 AM", type: "BUY", price: "45,232.50", amount: "0.05 BTC", profit: null },
    { time: "11:30 AM", type: "SELL", price: "45,832.20", amount: "0.05 BTC", profit: "+2.1%" },
    { time: "12:15 PM", type: "BUY", price: "45,632.80", amount: "0.06 BTC", profit: null },
    { time: "01:20 PM", type: "SELL", price: "46,123.40", amount: "0.06 BTC", profit: "+1.8%" },
]

export default function BotDetailsPage({ params }: { params: Promise<{ botId: string }> }) {
    console.log(params)
    const router = useRouter()
    const [showConfirmClose, setShowConfirmClose] = useState(false)

    const chartOptions: ApexOptions = {
        chart: {
            type: "candlestick",
            height: 400,
            toolbar: { show: false },
            background: "transparent",
        },
        theme: { mode: "dark" },
        xaxis: {
            type: "datetime",
            labels: {
                style: { colors: "#fff" },
            }
        },
        yaxis: {
            tooltip: { enabled: true },
            labels: {
                style: { colors: "#fff" },
            }
        },
        grid: { borderColor: "#ffffff1a" },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: "#26a69a",
                    downward: "#ef5350"
                }
            }
        }
    }

    const handleClose = () => {
        router.push("/dashboard/transactions/success?type=bot&action=close&profit=15.8")
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white pb-[5rem]">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                    <TopBar title="Bot Details" />
                    <div className="p-4 lg:p-8">
                        {/* Bot Info */}
                        <div className="bg-[#121212] rounded-[1rem] p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">BTC Momentum Bot</h2>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-gray-400" />
                                    <span className="text-gray-400">2d 5h remaining</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                    <div className="text-sm text-gray-400 mb-1">Current Profit</div>
                                    <div className="text-2xl font-bold text-green-500">+15.8%</div>
                                </div>
                                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                    <div className="text-sm text-gray-400 mb-1">Stop Loss</div>
                                    <div className="text-2xl font-bold">$42,500</div>
                                </div>
                                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                    <div className="text-sm text-gray-400 mb-1">Take Profit</div>
                                    <div className="text-2xl font-bold">$48,000</div>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="h-[400px] mb-6">
                                <Chart
                                    options={chartOptions}
                                    series={[{ data: generateChartData() }]}
                                    type="candlestick"
                                    height={400}
                                />
                            </div>

                            {/* Recent Trades */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="text-left text-sm text-gray-400">
                                            <tr>
                                                <th className="pb-4">Time</th>
                                                <th className="pb-4">Type</th>
                                                <th className="pb-4">Price</th>
                                                <th className="pb-4">Amount</th>
                                                <th className="pb-4">Profit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trades.map((trade, index) => (
                                                <tr key={index} className="border-t border-gray-800">
                                                    <td className="py-4">{trade.time}</td>
                                                    <td className={`py-4 ${trade.type === "BUY" ? "text-green-500" : "text-red-500"}`}>
                                                        {trade.type}
                                                    </td>
                                                    <td className="py-4">${trade.price}</td>
                                                    <td className="py-4">{trade.amount}</td>
                                                    <td className="py-4 text-green-500">{trade.profit}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowConfirmClose(true)}
                                className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-medium"
                            >
                                Close Bot
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmClose && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#121212] rounded-[1rem] p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4 text-yellow-500">
                            <AlertTriangle size={24} />
                            <h3 className="text-xl font-semibold">Confirm Close</h3>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to close this bot? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirmClose(false)}
                                className="flex-1 bg-[#1A1A1A] hover:bg-[#242424] py-3 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClose}
                                className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-lg font-medium"
                            >
                                Close Bot
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function generateChartData() {
    return Array.from({ length: 50 }, () => ({
        x: new Date(Date.now() - Math.random() * 1000000000),
        y: [
            Math.random() * 1000 + 44000,
            Math.random() * 1000 + 44500,
            Math.random() * 1000 + 44000,
            Math.random() * 1000 + 44500
        ]
    })).sort((a, b) => a.x.getTime() - b.x.getTime())
}