"use client"

import { use, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { ArrowDownUp, ChevronDown } from "lucide-react"
import * as Select from '@radix-ui/react-select'
import { useRouter } from 'next/navigation'

const coins = [
  { symbol: "BTC", name: "Bitcoin", icon: "₿", price: 45678.90 },
  { symbol: "ETH", name: "Ethereum", icon: "Ξ", price: 2345.67 },
  { symbol: "SOL", name: "Solana", icon: "◎", price: 98.76 },
]

export default function SwapPage({ searchParams }: { searchParams: Promise<{ symbol: string }> }) {
  const router = useRouter()
  const resolvedParams = use(searchParams)
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [isFromUSD, setIsFromUSD] = useState(false)
  const [isToUSD, setIsToUSD] = useState(false)
  const [fromCoin, setFromCoin] = useState(
    coins.find(c => c.symbol === resolvedParams.symbol) || coins[0]
  )
  const [toCoin, setToCoin] = useState(coins[1])

  const handleSwitch = () => {
    const tempCoin = fromCoin
    setFromCoin(toCoin)
    setToCoin(tempCoin)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const calculateToAmount = (amount: string, isUSD: boolean) => {
    if (!amount) return ""
    const fromValue = isUSD ? Number(amount) / fromCoin.price : Number(amount)
    const toValue = isToUSD ? fromValue * fromCoin.price / toCoin.price : fromValue * fromCoin.price / toCoin.price
    return toValue.toFixed(isToUSD ? 2 : 8)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/dashboard/transactions/success?amount=${fromAmount}&fromSymbol=${fromCoin.symbol}&toSymbol=${toCoin.symbol}&toAmount=${toAmount}&type=swap`)
  }

interface Coin {
  symbol: string;
  name: string;
  icon: string;
  price: number;
}

interface TokenSelectProps {
  value: Coin;
  onChange: (coin: Coin) => void;
  coins: Coin[];
}

const TokenSelect = ({ value, onChange, coins }: TokenSelectProps) => (
  <Select.Root value={value.symbol} onValueChange={(symbol: string) => {
    const coin = coins.find(c => c.symbol === symbol)
    if (coin) onChange(coin)
  }}>
      <Select.Trigger className="flex items-center gap-2 bg-[#121212] px-3 py-2 rounded-lg">
        <span className="text-lg">{value.icon}</span>
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="bg-[#1A1A1A] rounded-lg p-1 shadow-xl">
          <Select.Viewport>
            {coins.filter(c => c.symbol !== value.symbol).map((coin) => (
              <Select.Item
                key={coin.symbol}
                value={coin.symbol}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#242424] rounded cursor-pointer"
              >
                <span className="text-lg">{coin.icon}</span>
                <Select.ItemText>{coin.symbol}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopBar title="Swap" />
          <div className="p-4 lg:p-8 max-w-2xl mx-auto">
            <div className="bg-[#121212] rounded-[1rem] p-6">
              <h2 className="text-2xl font-bold mb-6">Swap Tokens</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-400">You Pay</label>
                    <div className="flex items-center gap-2 bg-[#121212] rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setIsFromUSD(false)}
                        className={`px-3 py-1 rounded text-sm ${!isFromUSD ? 'bg-orange-500' : 'hover:bg-[#242424]'}`}
                      >
                        {fromCoin.symbol}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFromUSD(true)}
                        className={`px-3 py-1 rounded text-sm ${isFromUSD ? 'bg-orange-500' : 'hover:bg-[#242424]'}`}
                      >
                        USD
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={fromAmount}
                        onChange={(e) => {
                          setFromAmount(e.target.value)
                          setToAmount(calculateToAmount(e.target.value, isFromUSD))
                        }}
                        className="w-full bg-transparent text-2xl outline-none"
                        placeholder="0.00"
                        required
                      />
                      {fromAmount && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                          ≈ {isFromUSD 
                            ? `${(Number(fromAmount) / fromCoin.price).toFixed(8)} ${fromCoin.symbol}`
                            : `$${(Number(fromAmount) * fromCoin.price).toFixed(2)}`
                          }
                        </div>
                      )}
                    </div>
                    <TokenSelect value={fromCoin} onChange={setFromCoin} coins={coins} />
                  </div>
                </div>

                <div className="flex justify-center">
                  <button 
                    type="button" 
                    onClick={handleSwitch}
                    className="p-2 hover:bg-white/5 rounded-full"
                  >
                    <ArrowDownUp className="rotate-90" />
                  </button>
                </div>

                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-400">You Receive</label>
                    <div className="flex items-center gap-2 bg-[#121212] rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setIsToUSD(false)}
                        className={`px-3 py-1 rounded text-sm ${!isToUSD ? 'bg-orange-500' : 'hover:bg-[#242424]'}`}
                      >
                        {toCoin.symbol}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsToUSD(true)}
                        className={`px-3 py-1 rounded text-sm ${isToUSD ? 'bg-orange-500' : 'hover:bg-[#242424]'}`}
                      >
                        USD
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={toAmount}
                        onChange={(e) => setToAmount(e.target.value)}
                        className="w-full bg-transparent text-2xl outline-none"
                        placeholder="0.00"
                        required
                      />
                      {toAmount && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                          ≈ {isToUSD 
                            ? `${(Number(toAmount) / toCoin.price).toFixed(8)} ${toCoin.symbol}`
                            : `$${(Number(toAmount) * toCoin.price).toFixed(2)}`
                          }
                        </div>
                      )}
                    </div>
                    <TokenSelect value={toCoin} onChange={setToCoin} coins={coins} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium transition-colors"
                >
                  Swap {fromCoin.symbol} to {toCoin.symbol}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}