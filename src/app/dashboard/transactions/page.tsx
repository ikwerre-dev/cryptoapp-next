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
                  <TransactionList transactions={userData?.transactions || []} />

                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

