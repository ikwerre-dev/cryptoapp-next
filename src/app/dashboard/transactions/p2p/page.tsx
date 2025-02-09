"use client"

import { use, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { Copy,  ChevronDown } from "lucide-react"
import * as Select from '@radix-ui/react-select'
import { useRouter } from 'next/navigation'

const cryptoOptions = [
  { symbol: "BTC", name: "Bitcoin", icon: "₿", balance: 2.5384, price: 45678.90 },
  { symbol: "ETH", name: "Ethereum", icon: "Ξ", balance: 15.234, price: 2345.67 },
  { symbol: "SOL", name: "Solana", icon: "◎", balance: 145.67, price: 98.76 },
]

export default function P2PPage({ searchParams }: { searchParams: Promise<{ symbol: string }> }) {
  const router = useRouter()
  const resolvedParams = use(searchParams)
  const [amount, setAmount] = useState("")
  const [recipientCode, setRecipientCode] = useState("")
  const [isUSD, setIsUSD] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState(
    cryptoOptions.find(c => c.symbol === resolvedParams.symbol) || cryptoOptions[0]
  )
  const [copied, setCopied] = useState(false)
  const myP2PCode = `P2P-${selectedCrypto.symbol}-123456`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(myP2PCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cryptoAmount = isUSD ? Number(amount) / selectedCrypto.price : Number(amount)
    router.push(`/dashboard/transactions/success?amount=${cryptoAmount}&symbol=${selectedCrypto.symbol}&type=p2p&to=${recipientCode}`)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-[5rem]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopBar title="P2P Trade" />
          <div className="p-4 lg:p-8 max-w-6xl mx-auto">
            <div className="bg-[#121212] rounded-[1rem] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">P2P Trade</h2>
                <Select.Root 
                  value={selectedCrypto.symbol} 
                  onValueChange={(value) => {
                    const crypto = cryptoOptions.find(c => c.symbol === value)
                    if (crypto) setSelectedCrypto(crypto)
                  }}
                >
                  <Select.Trigger className="flex items-center gap-2 bg-[#1A1A1A] px-3 py-2 rounded-lg">
                    <span className="text-lg">{selectedCrypto.icon}</span>
                    <Select.Value>{selectedCrypto.symbol}</Select.Value>
                    <Select.Icon>
                      <ChevronDown className="h-4 w-4" />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content 
                      position="popper" 
                      className="bg-[#1A1A1A] rounded-lg p-1 shadow-xl z-[100] min-w-[180px]"
                      sideOffset={5}
                    >
                      <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-[#1A1A1A] cursor-default">
                        <ChevronDown className="h-4 w-4 rotate-180" />
                      </Select.ScrollUpButton>
                      <Select.Viewport className="p-1">
                        {cryptoOptions.map((crypto) => (
                          <Select.Item
                            key={crypto.symbol}
                            value={crypto.symbol}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-[#242424] rounded cursor-pointer outline-none data-[highlighted]:bg-[#242424]"
                          >
                            <span className="text-lg">{crypto.icon}</span>
                            <div>
                              <Select.ItemText>{crypto.symbol}</Select.ItemText>
                              <div className="text-xs text-gray-400">
                                Balance: {crypto.balance} {crypto.symbol}
                                <span className="ml-1">
                                  (${(crypto.balance * crypto.price).toFixed(2)})
                                </span>
                              </div>
                            </div>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div className="mb-8 bg-[#1A1A1A] p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-2">Your P2P Code</div>
                <div className="flex items-center justify-between gap-4">
                  <div className="font-mono text-lg">{myP2PCode}</div>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Copy size={20} className={copied ? "text-green-500" : "text-gray-400"} />
                  </button>
                </div>
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
                  <label className="text-sm text-gray-400">Recipient P2P Code</label>
                  <input
                    type="text"
                    value={recipientCode}
                    onChange={(e) => setRecipientCode(e.target.value)}
                    className="mt-2 w-full bg-[#1A1A1A] rounded-lg p-3 text-white"
                    placeholder={`Enter recipient's ${selectedCrypto.symbol} P2P code`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium transition-colors"
                >
                  Send {selectedCrypto.symbol} P2P Transfer
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}