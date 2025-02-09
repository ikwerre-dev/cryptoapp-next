"use client"

import { use, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { Copy, ChevronDown } from "lucide-react"
import QRCode from "react-qr-code"
import * as Select from '@radix-ui/react-select'
import { useRouter } from 'next/navigation'

const cryptoOptions = [
  { symbol: "BTC", name: "Bitcoin", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
  { symbol: "ETH", name: "Ethereum", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
  { symbol: "SOL", name: "Solana", address: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH" },
]

export default function DepositPage({ searchParams }: { searchParams: Promise<{ symbol: string }> }) {
  const router = useRouter()
  const resolvedParams = use(searchParams)
  const [copied, setCopied] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState(
    cryptoOptions.find(c => c.symbol === resolvedParams.symbol) || cryptoOptions[0]
  )

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedCrypto.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirmDeposit = () => {
    router.push(`/dashboard/transactions/success?type=deposit&symbol=${selectedCrypto.symbol}`)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-[5rem]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopBar title="Deposit" />
          <div className="p-4 lg:p-8 max-w-6xl mx-auto">
            <div className="bg-[#121212] rounded-[1rem] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Deposit {selectedCrypto.name}</h2>
                <Select.Root value={selectedCrypto.symbol} onValueChange={(value) => {
                  const crypto = cryptoOptions.find(c => c.symbol === value)
                  if (crypto) setSelectedCrypto(crypto)
                }}>
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
              
              <div className="flex justify-center mb-8">
                <div className="bg-white p-4 rounded-lg">
                  <QRCode 
                    value={selectedCrypto.address}
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Wallet Address</div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-mono text-sm break-all">{selectedCrypto.address}</div>
                    <button
                      onClick={copyToClipboard}
                      className="shrink-0 p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Copy size={20} className={copied ? "text-green-500" : "text-gray-400"} />
                    </button>
                  </div>
                </div>

                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Network</div>
                  <div className="font-medium">{selectedCrypto.name} Network ({selectedCrypto.symbol})</div>
                </div>

                <div className="bg-orange-500/20 text-orange-500 p-4 rounded-lg text-sm">
                  Only send {selectedCrypto.symbol} to this address. Sending any other asset may result in permanent loss.
                </div>

                <button
                  onClick={handleConfirmDeposit}
                  className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium transition-colors mt-6"
                >
                  I Have Sent {selectedCrypto.symbol}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}