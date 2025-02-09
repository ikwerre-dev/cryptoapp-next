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



export default function DashboardPage() {
  const { userData, isLoading, error, refetch, totalBalance } = useUserData()
  const { cryptoData, calculateUserAssetValue } = useCryptoData()
  const [isRefetching, setIsRefetching] = useState(false)

  useEffect(() => {
    console.log(userData?.user)
  }, [userData])






  const handleRefetch = useCallback(async () => {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)
  }, [refetch])



  useEffect(() => {
    const interval = setInterval(() => {
      handleRefetch();
    }, 5000)

    return () => clearInterval(interval)
  }, [])



  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-[5rem]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopBar title="Transactions" notices={userData?.notices} />
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 w-full  p-4 lg:p-8">

              <div>

                <div className="space-y-2">
                  {userData?.transactions?.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-[#121212] p-4">
                      <div className="flex items-center gap-4">
                        <div className={`rounded-lg ${tx.status == "completed" ? "bg-green-500/20" : tx.status == "pending" ? "bg-orange-500/20" : "bg-red-500/20"} p-2`}>
                          {tx.status == "completed" ? (
                            <ArrowUp className="h-5 w-5 text-green-500" />
                          ) : tx.status == "pending" ? (
                            <ArrowDown className="h-5 w-5 text-orange-500" />
                          ) :
                            (
                              <ArrowDown className="h-5 w-5 text-red-500" />
                            )
                          }
                        </div>
                        <div>
                          <div className="font-medium">{tx.type}</div>
                          <div className="text-sm text-gray-400">
                            {(() => {
                              const date = new Date(tx.created_at);
                              const day = date.getDate();
                              const suffix = (day: number) => {
                                if (day > 3 && day < 21) return 'th';
                                switch (day % 10) {
                                  case 1: return 'st';
                                  case 2: return 'nd';
                                  case 3: return 'rd';
                                  default: return 'th';
                                }
                              };
                              return date.toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              }).replace(/\d+/, day + suffix(day));
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col ">
                        <div className={`${tx.status === "completed" ? "text-green-500" : tx.status === "pending" ? "text-orange-500" : "text-red-500"}`}>
                          {Number(tx.amount) == 0 ? '' : '$' + Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="flex flex-col justify-end items-end">
                          <div
                            className={` md:flex rounded-full text-end px-3 py-1 text-xs ${tx.status == "completed" ? "bg-green-500/20" : tx.status == "pending" ? "bg-orange-500/20" : "bg-red-500/20"}`}
                          >
                            {tx.status}
                          </div>
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
    </div>
  )
}

