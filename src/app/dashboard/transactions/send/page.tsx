"use client"

import { use, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { ArrowRight, ChevronDown } from "lucide-react"
import * as Select from '@radix-ui/react-select'
import { useRouter } from 'next/navigation'

const cryptoOptions = [
  { symbol: "BTC", name: "Bitcoin", gasFee: 0.0005, price: 45678.90 },
  { symbol: "ETH", name: "Ethereum", gasFee: 0.003, price: 2345.67 },
  { symbol: "SOL", name: "Solana", gasFee: 0.001, price: 98.76 },
]

export default function SendPage({ searchParams }: { searchParams: Promise<{ symbol: string }> }) {
  const router = useRouter()
  const resolvedParams = use(searchParams)
  const [amount, setAmount] = useState("")
  const [isUSD, setIsUSD] = useState(false)
  const [address, setAddress] = useState("")
  const [selectedCrypto, setSelectedCrypto] = useState(
    cryptoOptions.find(c => c.symbol === resolvedParams.symbol) || cryptoOptions[0]
  )

  const gasPrice = `${selectedCrypto.gasFee} ${selectedCrypto.symbol}`
  const cryptoAmount = isUSD ? Number(amount) / selectedCrypto.price : Number(amount)
  const total = cryptoAmount ? 
    `${(cryptoAmount + selectedCrypto.gasFee).toFixed(8)} ${selectedCrypto.symbol}` : 
    `0 ${selectedCrypto.symbol}`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/dashboard/transactions/success?amount=${cryptoAmount}&symbol=${selectedCrypto.symbol}&type=send&to=${address}`)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopBar title="Send" />
          <div className="p-4 lg:p-8 max-w-2xl mx-auto">
            <div className="bg-[#121212] rounded-[1rem] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Send {selectedCrypto.name}</h2>
                <Select.Root 
                  value={selectedCrypto.symbol} 
                  onValueChange={(value) => {
                    const crypto = cryptoOptions.find(c => c.symbol === value)
                    if (crypto) setSelectedCrypto(crypto)
                  }}
                >
                  <Select.Trigger className="flex items-center gap-2 bg-[#1A1A1A] px-3 py-2 rounded-lg">
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDown className="h-4 w-4" />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content className="bg-[#1A1A1A] rounded-lg p-1 shadow-xl">
                      <Select.Viewport>
                        {cryptoOptions.map((crypto) => (
                          <Select.Item
                            key={crypto.symbol}
                            value={crypto.symbol}
                            className="flex items-center px-3 py-2 hover:bg-[#242424] rounded cursor-pointer"
                          >
                            <Select.ItemText>{crypto.symbol}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-400">Amount</label>
                    <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setIsUSD(false)}
                        className={`px-3 py-1 rounded text-sm ${!isUSD ? 'bg-orange-500' : 'hover:bg-[#242424]'}`}
                      >
                        {selectedCrypto.symbol}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsUSD(true)}
                        className={`px-3 py-1 rounded text-sm ${isUSD ? 'bg-orange-500' : 'hover:bg-[#242424]'}`}
                      >
                        USD
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-2 w-full bg-[#1A1A1A] rounded-lg p-3 text-white"
                      placeholder="0.00"
                      required
                    />
                    {amount && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                        ≈ {isUSD 
                          ? `${(Number(amount) / selectedCrypto.price).toFixed(8)} ${selectedCrypto.symbol}`
                          : `$${(Number(amount) * selectedCrypto.price).toFixed(2)}`
                        }
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Recipient Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-2 w-full bg-[#1A1A1A] rounded-lg p-3 text-white"
                    placeholder={`Enter ${selectedCrypto.symbol} address`}
                    required
                  />
                </div>

                <div className="bg-[#1A1A1A] p-4 rounded-lg space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Gas Fee</span>
                    <span>{gasPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total</span>
                    <span>{total}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium transition-colors"
                >
                  Send {selectedCrypto.symbol}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}