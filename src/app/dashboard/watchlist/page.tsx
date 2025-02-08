"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { Star, Plus, ChevronDown, ChevronUp, Search } from "lucide-react"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })
import type { ApexOptions } from "apexcharts"

const watchlistData = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    price: 45678.90,
    change24h: 2.5,
    marketCap: "890.5B",
    volume24h: "25.6B",
    sparklineData: Array.from({ length: 24 }, () => Math.random() * 1000 + 44000)
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    price: 2345.67,
    change24h: -1.2,
    marketCap: "280.3B",
    volume24h: "15.2B",
    sparklineData: Array.from({ length: 24 }, () => Math.random() * 100 + 2200)
  },
  {
    id: 3,
    name: "Solana",
    symbol: "SOL",
    price: 98.76,
    change24h: 5.8,
    marketCap: "42.1B",
    volume24h: "3.8B",
    sparklineData: Array.from({ length: 24 }, () => Math.random() * 10 + 90)
  }
]

export default function WatchlistPage() {
  const [search, setSearch] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: "marketCap", direction: "desc" })

  const sparklineOptions: ApexOptions = {
    chart: {
      type: "line",
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: 2 },
    tooltip: { enabled: false },
    theme: { mode: "dark" }
  }

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    })
  }

  const sortedData = [...watchlistData].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b] ? 1 : -1
    }
    return a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b] ? 1 : -1
  })

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-[5rem]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopBar title="Watchlist" />
          <div className="p-4 lg:p-8">
            {/* Search and Add */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search coins..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#121212] rounded-lg pl-10 pr-4 py-3 text-white"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Coin
              </button>
            </div>

            {/* Watchlist Table */}
            <div className="bg-[#121212] rounded-[1rem] p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400">
                    <th className="pb-4 pl-4">Favorite</th>
                    <th className="pb-4">Asset</th>
                    <th className="pb-4 cursor-pointer" onClick={() => handleSort("price")}>
                      <div className="flex items-center gap-2">
                        Price
                        {sortConfig.key === "price" && (
                          sortConfig.direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th className="pb-4 cursor-pointer" onClick={() => handleSort("change24h")}>
                      <div className="flex items-center gap-2">
                        24h Change
                        {sortConfig.key === "change24h" && (
                          sortConfig.direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th className="pb-4 cursor-pointer" onClick={() => handleSort("marketCap")}>
                      <div className="flex items-center gap-2">
                        Market Cap
                        {sortConfig.key === "marketCap" && (
                          sortConfig.direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th className="pb-4">24h Chart</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((coin) => (
                    <tr key={coin.id} className="border-t border-gray-800">
                      <td className="py-4 pl-4">
                        <Star className="text-orange-500 cursor-pointer" size={20} fill="#f97316" />
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium">{coin.name}</div>
                            <div className="text-sm text-gray-400">{coin.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">${coin.price.toLocaleString()}</td>
                      <td className={`py-4 ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                      </td>
                      <td className="py-4">${coin.marketCap}</td>
                      <td className="py-4 w-[200px]">
                        <Chart
                          options={{
                            ...sparklineOptions,
                            colors: [coin.change24h >= 0 ? '#22c55e' : '#ef4444']
                          }}
                          series={[{ data: coin.sparklineData }]}
                          type="line"
                          height={50}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Coin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#121212] rounded-[1rem] p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Add to Watchlist</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search cryptocurrency..."
                className="w-full bg-[#1A1A1A] rounded-lg pl-10 pr-4 py-3"
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {/* Sample search results */}
              <button className="w-full text-left p-3 hover:bg-[#1A1A1A] rounded-lg transition-colors">
                <div className="font-medium">Cardano</div>
                <div className="text-sm text-gray-400">ADA</div>
              </button>
              <button className="w-full text-left p-3 hover:bg-[#1A1A1A] rounded-lg transition-colors">
                <div className="font-medium">Polkadot</div>
                <div className="text-sm text-gray-400">DOT</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}