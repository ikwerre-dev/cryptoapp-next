"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { ArrowDown, ArrowUp, ChevronDown, Eye, EyeOff, RefreshCw } from "lucide-react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })
import type { ApexOptions } from "apexcharts"
import { useUserData } from "@/hooks/useUserData"
import { useCryptoData } from "@/hooks/useCryptoData"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { Coins, Wallet } from 'lucide-react';
import { TransactionList } from "@/components/dashboard/TransactionList"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { InvestmentList } from "@/components/dashboard/InvestmentList"
import { TradingChart } from "@/components/trading/TradingChart"
import { AccountInfo } from "@/components/dashboard/AccountInfo";

const timeFilters = ["1M", "5M", "15M", "30M", "1H"]


export default function DashboardPage() {
  const [chartType] = useState<"price" | "candle">("candle")
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("1M")
  const [showBalance, setShowBalance] = useState(true)
  const toggleBalance = () => setShowBalance(!showBalance)
  const { userData, isLoading, refetch, totalBalance } = useUserData()
  const { cryptoData, calculateUserAssetValue } = useCryptoData()
  const [btcValue, setBtcValue] = useState(0)
  const [isRefetching, setIsRefetching] = useState(false)
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const balances = [
    { name: "BTC", balance: Number(userData?.user.btc_balance || "0") },
    { name: "ETH", balance: Number(userData?.user.eth_balance || "0") },
    { name: "USDT", balance: Number(userData?.user.usdt_balance || "0") },
    { name: "BNB", balance: Number(userData?.user.bnb_balance || "0") },
    { name: "XRP", balance: Number(userData?.user.xrp_balance || "0") },
    { name: "ADA", balance: Number(userData?.user.ada_balance || "0") },
    { name: "DOGE", balance: Number(userData?.user.doge_balance || "0") },
    { name: "SOL", balance: Number(userData?.user.sol_balance || "0") },
    { name: "DOT", balance: Number(userData?.user.dot_balance || "0") },
    { name: "MATIC", balance: Number(userData?.user.matic_balance || "0") },
    { name: "LINK", balance: Number(userData?.user.link_balance || "0") },
    { name: "UNI", balance: Number(userData?.user.uni_balance || "0") },
    { name: "AVAX", balance: Number(userData?.user.avax_balance || "0") },
    { name: "LTC", balance: Number(userData?.user.ltc_balance || "0") },
    { name: "SHIB", balance: Number(userData?.user.shib_balance || "0") },
  ]

  const topAssets = balances
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 6)
    .map((asset) => ({
      name: asset.name,
      value: asset.balance,
      icon: asset.name.charAt(0),
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-500",
    }))

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const token = Cookies.get("auth-token");
        const response = await fetch("/api/investments/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch investments");

        const data = await response.json();
        if (data.success) {
          setInvestments(data.investments);
        } else {
          throw new Error(data.error || "Failed to fetch investments");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load investments");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  const fetchBtcBalance = () => {
    const btcValue = calculateUserAssetValue(totalBalance, "bitcoin")

    setBtcValue(btcValue && Number((totalBalance / btcValue).toFixed(6)))

  }

  const handleRefetch = useCallback(async () => {
    setIsRefetching(true)
    await refetch()
    fetchBtcBalance()
    setIsRefetching(false)
  }, [refetch])


  useEffect(() => {
    fetchBtcBalance()
  }, [totalBalance, calculateUserAssetValue])


  useEffect(() => {
    const interval = setInterval(() => {
      handleRefetch();
    }, 5000)

    return () => clearInterval(interval)
  }, [])



  {/* Chart */ }
  // Add this state near your other state declarations
  const [activeSession, setActiveSession] = useState<number | null>(null);

  // Add this function before the return statement
  const fetchActiveSession = async () => {
    try {
      const response = await fetch("/api/trading/sessions?status=active", {
        headers: {
          Authorization: `Bearer ${Cookies.get("auth-token")}`,
        },
      });
      const data = await response.json();
      if (data.sessions && data.sessions.length > 0) {
        setActiveSession(data.sessions[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch active session");
    }
  };

  // Add this useEffect after your other useEffects
  useEffect(() => {
    fetchActiveSession();
  }, []);


  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-[5rem]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopBar title="Dashboard" notices={userData?.notices} />
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 w-full lg:max-w-[calc(100%-320px)] p-4 lg:p-8">
              <div className="bg-[#121212] flex  lg:flex-row justify-between md:items-center px-[1rem] lg:px-[1.5rem] rounded-[1rem] py-4 lg:py-[1.5rem] mb-8">
                <div className="flex flex-col gap-2 mb-4 lg:mb-0">
                  <div className="text-sm text-gray-400">Total asset value</div>
                  <div className="flex items-center gap-2">
                    <div className="text-4xl font-bold tracking-tight">
                      {showBalance
                        ? `$ ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : "$ ••••••••••"}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">≈ {btcValue} BTC</div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleRefetch}
                    disabled={isRefetching}
                    className="rounded-full bg-white/20 p-3 hover:bg-gray-700/50"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
                  </button>
                  <button className="rounded-full bg-white/20 p-3 hover:bg-gray-700/50" onClick={toggleBalance}>
                    {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="mb-6">
                <AccountInfo limit={1} />
              </div>

              <div className="mb-8 ">
                <div className="flex pl-1 items-center justify-between flex-wrap">
                  <div className="mb-4 text-base font-medium">My Portfolio</div>
                  <div className="mb-4 flex items-center gap-4  ">
                    <div className="flex rounded-lg bg-[#121212]  p-1">

                    </div>
                  </div>
                </div>


                <div className="relative w-full rounded-[1rem] bg-[#121212] p-4">
                  {activeSession ? (
                    <TradingChart sessionId={activeSession} height="300px" />
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-400">
                      No active trading sessions
                    </div>
                  )}
                </div>
              </div>
              <div className="">
                <div className="bg-[#121212] rounded-[1rem] p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Recent Investments</h2>
                    <button
                      onClick={() => router.push('/dashboard/investments')}
                      className="text-orange-500 hover:text-orange-600"
                    >
                      View All
                    </button>
                  </div>
                  <InvestmentList investments={investments} limit={1} />
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-lg font-medium">Transaction</div>
                  <Link href={"/transactions"} className="text-sm text-purple-500 hover:text-purple-400">Sell All</Link>
                </div>
                <div className="space-y-2">
                  <TransactionList transactions={userData?.transactions || []} number={5} />
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-80 border-t lg:border-l border-gray-800/50 p-4 lg:p-5">
              <div className="flex border-b border-gray-800/50  flex-col">
                <div className="mb-6 flex items-center justify-between">
                  <div className="text-lg font-medium">Assets</div>
                  <Link href="/dashboard/portfolio" className="text-sm text-gray-400 hover:text-gray-300">See All</Link>
                </div>

                <div className="mb-8 grid grid-cols-2 gap-3">
                  {topAssets && topAssets.map((asset) => (
                    <div key={asset.name} onClick={() => router.push(`/dashboard/portfolio/${asset.name}`)} className="cursor-pointer rounded-lg bg-[#121212] p-3 transition-colors hover:bg-[#1A1A1A]">
                      <div className="mb-3 flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${asset.iconBg}`}>
                          <span className={`text-lg ${asset.iconColor}`}>{asset.icon}</span>
                        </div>
                        <span className="font-medium">{asset.name}</span>
                      </div>
                      <div className="mb-1 text-lg font-bold">${asset.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>

                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="">
                  <div className="bg-[#121212] rounded-[1rem]  py-4 px-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-sm font-semibold">Recent Investments</h2>
                      <button
                        onClick={() => router.push('/dashboard/investments')}
                        className="text-orange-500 text-sm hover:text-orange-600"
                      >
                        View All
                      </button>
                    </div>
                    <InvestmentList investments={investments} limit={2} />
                  </div>
                </div>

                <div className="mb-4 text-lg font-medium">Quick Actions</div>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/dashboard/invest"
                    className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 py-3 text-sm font-medium transition-colors hover:bg-orange-600"
                  >
                    <Coins className="h-4 w-4" />
                    Invest
                  </Link>
                  <Link
                    href="/dashboard/transactions/send"
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#121212] py-3 text-sm font-medium transition-colors hover:bg-[#1A1A1A]"
                  >
                    <Wallet className="h-4 w-4" />
                    Send
                  </Link>
                  <Link
                    href="/dashboard/transactions/deposit"
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#121212] py-3 text-sm font-medium transition-colors hover:bg-[#1A1A1A]"
                  >
                    <Wallet className="h-4 w-4" />
                    Deposit
                  </Link>
                  <Link
                    href="/dashboard/transactions/p2p"
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#121212] py-3 text-sm font-medium transition-colors hover:bg-[#1A1A1A]"
                  >
                    <Wallet className="h-4 w-4" />
                    P2P
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

