"use client"

import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { ArrowDown, ArrowUp, Calendar } from "lucide-react"

const historicalBots = [
  {
    id: 1,
    name: "BTC Momentum Bot",
    startDate: "Oct 15, 2023",
    endDate: "Oct 22, 2023",
    profit: "+23.5%",
    trades: 45,
    winRate: "68%"
  },
  {
    id: 2,
    name: "ETH Scalping Bot",
    startDate: "Oct 1, 2023",
    endDate: "Oct 15, 2023",
    profit: "-5.2%",
    trades: 128,
    winRate: "48%"
  },
  {
    id: 3,
    name: "SOL DCA Bot",
    startDate: "Sep 20, 2023",
    endDate: "Sep 27, 2023",
    profit: "+12.8%",
    trades: 32,
    winRate: "72%"
  }
]

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopBar title="Bot History" />
          <div className="p-4 lg:p-8">
            <div className="bg-[#121212] rounded-[1rem] p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Trading History</h2>
                <p className="text-gray-400">View your past trading bot performance</p>
              </div>

              <div className="space-y-4">
                {historicalBots.map((bot) => (
                  <div key={bot.id} className="bg-[#1A1A1A] p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium mb-1">{bot.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar size={14} />
                          {bot.startDate} - {bot.endDate}
                        </div>
                      </div>
                      <div className={`text-lg font-medium ${
                        bot.profit.startsWith('+') ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {bot.profit}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">Total Trades</div>
                        <div className="font-medium">{bot.trades}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Win Rate</div>
                        <div className="font-medium">{bot.winRate}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}