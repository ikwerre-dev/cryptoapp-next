"use client"

import { use, useState } from "react"
import { ArrowDown, ArrowUp, ChevronDown, Send, Repeat, Users } from "lucide-react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })
import type { ApexOptions } from "apexcharts"
import Link from 'next/link'

const timeFilters = ["1H", "24H", "7D", "1M", "1Y"]

export default function AssetPage({ params }: { params: Promise<{ symbol: string }> }) {
    const resolvedParams = use(params)
    const [selectedTimeFilter, setSelectedTimeFilter] = useState("24H")
    const symbol = resolvedParams.symbol.toUpperCase()

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
            labels: { style: { colors: "#fff" } }
        },
        yaxis: {
            labels: { style: { colors: "#fff" } }
        },
        grid: { borderColor: "#ffffff1a" },
        tooltip: { theme: "dark" }
    }

    const generateCandlestickData = () => {
        const data = []
        const now = new Date()
        for (let i = 0; i < 50; i++) {
            const time = new Date(now.getTime() - i * 3600000)
            const open = Math.random() * 1000 + 20000
            const close = Math.random() * 1000 + 20000
            const high = Math.max(open, close) + Math.random() * 500
            const low = Math.min(open, close) - Math.random() * 500
            data.push({
                x: time.getTime(),
                y: [open, high, low, close]
            })
        }
        return data.reverse()
    }

    // Action button component to avoid repetition
    const ActionButton = ({ 
        href, 
        icon: Icon, 
        label, 
        primary = false 
    }: {
        href: string;
        icon: React.ElementType;
        label: string;
        primary?: boolean;
    }) => (
        <Link
            href={`/dashboard/transactions/${href}?symbol=${symbol}`}
            className={`w-full rounded-lg ${primary ? 'bg-orange-500 hover:bg-orange-600' : 'bg-[#121212] hover:bg-[#1A1A1A]'
                } py-3 font-medium transition-colors flex items-center justify-center gap-2`}
        >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{label}</span>
        </Link>
    )

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                    <TopBar title={`${symbol} Details`} />
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex-1 w-full lg:max-w-[calc(100%-320px)] p-4 lg:p-8">
                            {/* Asset Header */}
                            <div className="bg-[#121212] rounded-[1rem] p-6 mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold">Bitcoin (BTC)</h2>
                                        <div className="text-gray-400">Current Price: $45,678.90</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold">2.5384 BTC</div>
                                        <div className="text-gray-400">≈ $115,897.43</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-green-500">
                                    <ArrowUp className="h-4 w-4" />
                                    <span>2.5% (24h)</span>
                                </div>
                            </div>
                            <div className="md:hidden w-full lg:w-80 border-t lg:border-l border-gray-800/50 p-4 lg:p-5">
                                <div className="space-y-4">
                                    <ActionButton href="deposit" icon={ArrowUp} label="Deposit" primary />
                                    <ActionButton href="send" icon={Send} label="Send" />
                                    <ActionButton href="swap" icon={Repeat} label="Swap" />
                                    <ActionButton href="p2p" icon={Users} label="P2P Trade" />
                                </div>
                            </div>
                            {/* Chart Section */}
                            <div className="bg-[#121212] rounded-[1rem] p-6 mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium">Price Chart</h3>
                                    <div className="flex rounded-lg bg-[#1A1A1A] p-1">
                                        {timeFilters.map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setSelectedTimeFilter(filter)}
                                                className={`rounded px-3 py-1.5 text-sm ${selectedTimeFilter === filter ? "bg-orange-500" : "hover:bg-[#242424]"
                                                    }`}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Chart
                                    options={chartOptions}
                                    series={[{ data: generateCandlestickData() }]}
                                    type="candlestick"
                                    height={400}
                                />
                            </div>

                            {/* Market Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-[#121212] rounded-[1rem] p-4">
                                    <div className="text-gray-400">24h Volume</div>
                                    <div className="text-xl font-bold">$24.5B</div>
                                </div>
                                <div className="bg-[#121212] rounded-[1rem] p-4">
                                    <div className="text-gray-400">Market Cap</div>
                                    <div className="text-xl font-bold">$845.2B</div>
                                </div>
                                <div className="bg-[#121212] rounded-[1rem] p-4">
                                    <div className="text-gray-400">Circulating Supply</div>
                                    <div className="text-xl font-bold">19.5M BTC</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Actions */}
                        <div className="w-full lg:w-80 border-t lg:border-l border-gray-800/50 p-4 lg:p-5">
                            <div className="space-y-4">
                                <ActionButton href="deposit" icon={ArrowUp} label="Deposit" primary />
                                <ActionButton href="send" icon={Send} label="Send" />
                                <ActionButton href="swap" icon={Repeat} label="Swap" />
                                <ActionButton href="p2p" icon={Users} label="P2P Trade" />
                            </div>

                            {/* Transaction History */}
                            <div className="mt-8">
                                <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
                                <div className="space-y-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="bg-[#121212] rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-medium">
                                                    {i % 2 === 0 ? "Received" : "Sent"} BTC
                                                </div>
                                                <div className={`text-sm ${i % 2 === 0 ? "text-green-500" : "text-red-500"}`}>
                                                    {i % 2 === 0 ? "+" : "-"}0.05 BTC
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                2 hours ago
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}