"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
 import { Clock, Percent } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })
import type { ApexOptions } from "apexcharts"

// Update mock data for candlestick
const mockData = generateChartData()

function generateChartData() {
  return Array.from({ length: 20 }, () => ({
    x: new Date(Date.now() - Math.random() * 1000000000),
    y: [
      Math.random() * 1000 + 44000,
      Math.random() * 1000 + 44500,
      Math.random() * 1000 + 44000,
      Math.random() * 1000 + 44500
    ]
  })).sort((a, b) => a.x.getTime() - b.x.getTime())
}

export default function AITradingPage() {
  const router = useRouter()
  const [showBuyOptions, setShowBuyOptions] = useState(false)

  const runningBots = [
    { id: 1, name: "BTC Momentum", profit: "+12.5%", timeLeft: "2d 5h", status: "active" },
    { id: 2, name: "ETH Scalper", profit: "+8.2%", timeLeft: "5d 12h", status: "active" },
    { id: 3, name: "SOL DCA", profit: "-2.1%", timeLeft: "1d 8h", status: "active" },
  ]

  const chartOptions: ApexOptions = {
    chart: {
      type: "candlestick",
      height: 300,
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

  const availableBots = [
    {
      id: 1,
      name: "BTC Momentum Bot",
      description: "Uses momentum indicators for BTC trading",
      roi: "15-25%",
      duration: "7 days",
      price: "0.01 BTC"
    },
    {
      id: 2,
      name: "ETH Scalping Bot",
      description: "High-frequency ETH trading bot",
      roi: "10-20%",
      duration: "14 days",
      price: "0.2 ETH"
    },
    {
      id: 3,
      name: "Multi-Coin Bot",
      description: "Trades top 5 cryptocurrencies",
      roi: "20-30%",
      duration: "30 days",
      price: "0.05 BTC"
    },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-[5rem]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopBar title="AI Trading" />
          <div className="p-4 lg:p-8">
            {/* Balance Card */}
            <div className="bg-[#121212] rounded-[1rem] p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Trading Balance</h2>
                <span className="text-green-500">+15.8%</span>
              </div>
              <div className="text-3xl font-bold mb-2">$12,458.90</div>
              <div className="text-gray-400">3.2 BTC</div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setShowBuyOptions(true)}
                className="bg-orange-500 hover:bg-orange-600 py-3 px-4 rounded-lg font-medium"
              >
                Buy Trading Bot
              </button>
              <Link
                href="/dashboard/Aitrading/history"
                className="bg-[#121212] hover:bg-[#1A1A1A] py-3 px-4 rounded-lg font-medium text-center"
              >
                Previous Bots
              </Link>
            </div>

            {/* Trading Chart */}
            <div className="bg-[#121212] rounded-[1rem] p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Performance</h3>
              <div className="h-[300px]">
                <Chart
                  options={chartOptions}
                  series={[{ data: mockData }]}
                  type="candlestick"
                  height={300}
                />
              </div>
            </div>

            {/* Running Bots */}
            <div className="bg-[#121212] rounded-[1rem] p-6">
              <h3 className="text-xl font-semibold mb-4">Running Bots</h3>
              <div className="space-y-4">
                {runningBots.map((bot) => (
                  <div
                    key={bot.id}
                    onClick={() => router.push(`/dashboard/Aitrading/${bot.id}`)}
                    className="bg-[#1A1A1A] p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#242424] transition-colors"
                  >
                    <div>
                      <div className="font-medium">{bot.name}</div>
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        <Clock size={14} />
                        {bot.timeLeft} remaining
                      </div>
                    </div>
                    <div className={`text-lg ${bot.profit.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {bot.profit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buy Bot Modal */}
            {showBuyOptions && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-[#121212] rounded-[1rem] p-6 max-w-2xl w-full mx-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Available Trading Bots</h3>
                    <button
                      onClick={() => setShowBuyOptions(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-4">
                    {availableBots.map((bot) => (
                      <div key={bot.id} className="bg-[#1A1A1A] p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{bot.name}</h4>
                            <p className="text-sm text-gray-400">{bot.description}</p>
                          </div>
                          <div className="text-orange-500 font-medium">{bot.price}</div>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Percent size={14} />
                            ROI: {bot.roi}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            Duration: {bot.duration}
                          </div>
                        </div>
                        <button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 py-2 rounded-lg font-medium">
                          Purchase Bot
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}