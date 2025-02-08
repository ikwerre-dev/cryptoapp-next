"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, ChevronDown, Eye, EyeOff } from "lucide-react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })
import type { ApexOptions } from "apexcharts"
import { CryptoTicker } from "@/components/CryptoTicker"

const timeFilters = ["1M", "5M", "15M", "30M", "1H"]

const assets = [
  {
    name: "BTC",
    value: 24300.4,
    change: -1.2,
    icon: "₿",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-500",
  },
  {
    name: "UST",
    value: 13400.2,
    change: 0.4,
    icon: "⊮",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-500",
  },
  {
    name: "ETH",
    value: 4000.8,
    change: 3.4,
    icon: "Ξ",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-500",
  },
  {
    name: "CAR",
    value: 1900.1,
    change: -0.3,
    icon: "◎",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-500",
  },
]

const transactions = [
  {
    type: "Bitcoin",
    amount: "+0.431 BTC",
    value: "$3,489.90",
    time: "10:34AM",
    date: "2 Nov 2023",
    status: "Completed",
    isPositive: true,
  },
  {
    type: "Ethereum",
    amount: "-0.431 ETH",
    value: "$3,489.90",
    time: "07:21AM",
    date: "2 Nov 2023",
    status: "Terminated",
    isPositive: false,
  },
  {
    type: "Ethereum",
    amount: "+0.431 ETH",
    value: "$3,489.90",
    time: "07:21AM",
    date: "2 Nov 2023",
    status: "Completed",
    isPositive: true,
  },
]
const generateChartData = (type: "price" | "candle", dataLength = 15) => {
  const now = new Date()
  return Array.from({ length: dataLength }, (_, i) => {
    const date = new Date(now.getTime() - (dataLength - i) * 1000) // 1 second intervals
    const open = Number((Math.random() * 1000 + 20000).toFixed(0))
    const high = Number((open + Math.random() * 500).toFixed(0))
    const low = Number((open - Math.random() * 500).toFixed(0))
    const close = Number((low + Math.random() * (high - low)).toFixed(0))
    return {
      x: date.getTime(),
      y: type === "price" ? [close] : [open, high, low, close],
    }
  })
}

const generateNewDataPoint = () => {
  const now = new Date().getTime()
  const open = Number((Math.random() * 1000 + 20000).toFixed(0))
  const high = Number((open + Math.random() * 500).toFixed(0))
  const low = Number((open - Math.random() * 500).toFixed(0))
  const close = Number((low + Math.random() * (high - low)).toFixed(0))
  return {
    x: now,
    y: [open, high, low, close],
  }
}

// Update the initial state
export default function DashboardPage() {
  const [chartType] = useState<"price" | "candle">("candle")
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("1M")
  const [showBalance, setShowBalance] = useState(true)
  const [chartData, setChartData] = useState(generateChartData("candle", 15))

  const toggleBalance = () => setShowBalance(!showBalance)

  useEffect(() => {
    const interval = setInterval(() => { 
      setChartData((prevData) => {
        const newPoint = generateNewDataPoint()
        return [...prevData.slice(1), newPoint]
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const chartOptions: ApexOptions = {
    chart: {
      type: chartType == "price" ? "line" : "candlestick",
      height: 300,
      width: "100%",
      toolbar: { show: false },
      background: "transparent",
    },
    theme: {
      mode: "dark",
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#fff",
        },
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          hour: "HH:mm",
        },
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        style: {
          colors: "#fff",
        },
      },
    },
    tooltip: {
      theme: "dark",
    },
    grid: {
      borderColor: "#ffffff1a",
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#26a69a",
          downward: "#ef5350",
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: chartType === "price" ? 2 : 1,
    },
  }

  return (
     <div className="min-h-screen bg-[#0A0A0A] text-white pb-[5rem]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopBar title="Dashboard" />
          <div className="flex flex-col lg:flex-row">
            {/* Main Content */}
            <div className="flex-1 w-full lg:max-w-[calc(100%-320px)] p-4 lg:p-8">
              {/* Total Asset Value */}
              <div className="bg-[#121212] flex  lg:flex-row justify-between px-4 lg:px-[1.5rem] rounded-[1rem] py-4 lg:py-[1.5rem] mb-8">
                <div className=" flex flex-col gap-2">
                  <div className="text-sm text-gray-400">Total asset value</div>
                  <div className="flex items-center gap-2">
                    <div className="text-4xl font-bold tracking-tight">
                      {showBalance ? "$ 345,045.31" : "$ ••••••••••"}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">≈ 13.4578 BTC</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <button className="rounded-full bg-white/20 p-3  hover:bg-gray-700/50" onClick={toggleBalance}>
                    {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Market Overview */}
              <div className="mb-8 ">
                <div className="flex pl-1 items-center justify-between flex-wrap">
                   <div className="mb-4 text-base font-medium">My Portfolio</div>
                  <div className="mb-4 flex items-center gap-4  ">
                    <div className="flex rounded-lg bg-[#121212]  p-1">
                      {timeFilters.map((filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            setSelectedTimeFilter(filter)
                            const dataLength =
                              filter === "1M"
                                ? 15
                                : filter === "5M"
                                  ? 45
                                  : filter === "15M"
                                    ? 80
                                    : filter === "30M"
                                      ? 120
                                      : 200
                            setChartData(generateChartData(chartType, dataLength))
                          }}
                          className={`rounded px-3 py-1.5 text-sm ${
                            selectedTimeFilter === filter ? "bg-purple-500" : "hover:bg-gray-800"
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="relative  w-full  rounded-[1rem] bg-[#121212] p-4">
                  <Chart
                    options={{
                      ...chartOptions,
                      chart: {
                        ...chartOptions.chart,
                        animations: {
                          enabled: true,
                           dynamicAnimation: {
                            speed: 1000,
                          },
                        },
                      },
                    }}
                    series={[{ data: chartData }]}
                    type={chartType === "price" ? "line" : "candlestick"}
                    height={300}
                    width="100%"
                  />
                </div>
              </div>

              {/* Transactions */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-lg font-medium">Transaction</div>
                  <button className="text-sm text-purple-500 hover:text-purple-400">Sell All</button>
                </div>
                <div className="space-y-2">
                  {transactions.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-[#121212] p-4">
                      <div className="flex items-center gap-4">
                        <div className={`rounded-lg ${tx.isPositive ? "bg-green-500/20" : "bg-red-500/20"} p-2`}>
                          {tx.isPositive ? (
                            <ArrowUp className="h-5 w-5 text-green-500" />
                          ) : (
                            <ArrowDown className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{tx.type}</div>
                          <div className="text-sm text-gray-400">
                            {tx.date} {tx.time}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={tx.isPositive ? "text-green-500" : "text-red-500"}>{tx.amount}</div>
                        <div className="text-sm text-gray-400">{tx.value}</div>
                      </div>
                      <div
                        className={`hidden md:flex rounded-full px-3 py-1 text-sm ${
                          tx.status === "Completed" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {tx.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-80 border-t lg:border-l border-gray-800/50 p-4 lg:p-5">
              <div className="flex border-b border-gray-800/50  flex-col">
                <div className="mb-6 flex items-center justify-between">
                  <div className="text-lg font-medium">Assets</div>
                  <button className="text-sm text-gray-400 hover:text-gray-300">See All</button>
                </div>

                <div className="mb-8 grid grid-cols-2 gap-3">
                  {assets.map((asset) => (
                    <div key={asset.name} className="rounded-lg bg-[#121212] p-3 transition-colors hover:bg-[#1A1A1A]">
                      <div className="mb-3 flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${asset.iconBg}`}>
                          <span className={`text-lg ${asset.iconColor}`}>{asset.icon}</span>
                        </div>
                        <span className="font-medium">{asset.name}</span>
                      </div>
                      <div className="mb-1 text-lg font-bold">${asset.value.toLocaleString()}</div>
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          asset.change >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {asset.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        {Math.abs(asset.change)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="my-5">
                <div className="my-4 text-lg font-medium">Operation</div>
                <div className="flex gap-2">
                  <button className="flex-1 rounded-lg bg-orange-500 py-2 text-sm font-medium transition-colors hover:bg-orange-600">
                    Buy
                  </button>
                  <button className="flex-1 rounded-lg bg-[#121212] py-2 text-sm font-medium transition-colors hover:bg-[#1A1A1A]">
                    Sell
                  </button>
                  <button className="flex-1 rounded-lg bg-[#121212] py-2 text-sm font-medium transition-colors hover:bg-[#1A1A1A]">
                    Exchange
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <div className="text-sm text-gray-400">You pay</div>
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#121212] p-3">
                    <div className="flex-1">
                      <input type="text" defaultValue="321.40" className="w-full bg-transparent text-lg outline-none" />
                    </div>
                    <button className="flex items-center gap-2 rounded-lg bg-orange-500/20 px-2 py-1 text-sm text-orange-500">
                      UST
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="rounded bg-orange-500/20 px-2 py-1 text-xs text-orange-500">MAX</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-400">You get</div>
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#121212] p-3">
                    <div className="flex-1">
                      <input type="text" defaultValue="0.05" className="w-full bg-transparent text-lg outline-none" />
                    </div>
                    <button className="flex items-center gap-2 rounded-lg bg-orange-500/20 px-2 py-1 text-sm text-orange-500">
                      BTC
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="rounded bg-orange-500/20 px-2 py-1 text-xs text-orange-500">MIN</div>
                  </div>
                </div>

                <div className="mb-4 text-center text-sm text-gray-400">1 BTC = $2,345</div>

                <button className="w-full rounded-lg bg-orange-500 py-3 font-medium transition-colors hover:bg-orange-600">
                  Buy Bitcoin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

