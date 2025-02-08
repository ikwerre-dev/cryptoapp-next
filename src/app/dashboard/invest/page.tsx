"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

// Type definitions
type Currency = 'BTC' | 'ETH' | 'USDT'

// Define the amount range type with an index signature
type AmountRange = {
  [K in Currency]: number
}

interface InvestmentPackage {
  id: number
  name: string
  minAmount: AmountRange
  maxAmount: AmountRange
  duration: string
  roi: string
  risk: 'Low' | 'Medium' |'Moderate' | 'High'
  description: string
  features: string[]
}

interface ActiveInvestment {
  id: number
  package: string
  amount: string
  startDate: string
  endDate: string
  currentProfit: string
  status: string
}

// Currency type for the dropdown
interface CurrencyOption {
  symbol: Currency
  name: string
}


const investmentPackages: InvestmentPackage[] = [
    {
      id: 1,
      name: "Starter Package",
      minAmount: {
        BTC: 0.1,
        ETH: 1.5,
        USDT: 5000
      },
      maxAmount: {
        BTC: 0.5,
        ETH: 7.5,
        USDT: 25000
      },
      duration: "30 days",
      roi: "8-12%",
      risk: "Low",
      description: "Perfect for beginners looking to start their investment journey",
      features: ["Daily profit updates", "Auto-compound option", "Early withdrawal available"]
    },
    {
      id: 2,
      name: "Growth Package",
      minAmount: {
        BTC: 0.6,
        ETH: 8,
        USDT: 26000
      },
      maxAmount: {
        BTC: 2,
        ETH: 25,
        USDT: 75000
      },
      duration: "60 days",
      roi: "12-18%",
      risk: "Moderate",
      description: "Ideal for investors aiming for a higher return over a moderate period",
      features: ["Weekly profit reports", "Priority customer support", "Flexible investment options"]
    },
    {
      id: 3,
      name: "Premium Package",
      minAmount: {
        BTC: 2.1,
        ETH: 26,
        USDT: 76000
      },
      maxAmount: {
        BTC: 5,
        ETH: 70,
        USDT: 200000
      },
      duration: "90 days",
      roi: "20-30%",
      risk: "High",
      description: "Designed for seasoned investors seeking substantial returns",
      features: ["Dedicated account manager", "Advanced risk analysis", "Exclusive investment insights"]
    }
  ];

const activeInvestments: ActiveInvestment[] = [
  {
    id: 1,
    package: "Growth Package",
    amount: "1.2 BTC",
    startDate: "2023-11-01",
    endDate: "2023-12-31",
    currentProfit: "+12.5%",
    status: "Active"
  },
  {
    id: 2,
    package: "Starter Package",
    amount: "0.3 BTC",
    startDate: "2023-10-15",
    endDate: "2023-11-15",
    currentProfit: "+6.8%",
    status: "Active"
  }
]

const currencies: CurrencyOption[] = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "USDT", name: "Tether" }
]

export default function InvestPage() {
  const router = useRouter()
  
  // State management with proper typing
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("BTC")
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const [autoCompound, setAutoCompound] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<InvestmentPackage | null>(null)
  const [amount, setAmount] = useState("")

  const handleInvest = (pkg: InvestmentPackage) => {
    setSelectedPackage(pkg)
    setShowConfirm(true)
  }

  const confirmInvestment = () => {
    if (!amount || !selectedPackage) return
    
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum)) return
    
    const minAmount = selectedPackage.minAmount[selectedCurrency]
    const maxAmount = selectedPackage.maxAmount[selectedCurrency]
    
    if (amountNum < minAmount || amountNum > maxAmount) {
      alert("Please enter an amount within the allowed range")
      return
    }

    router.push(`/dashboard/transactions/success?type=investment&package=${selectedPackage.name}&amount=${amount}&currency=${selectedCurrency}&autoCompound=${autoCompound}`)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-[5rem]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopBar title="Invest" />
          <div className="p-4 lg:p-8">
            {/* Currency Selection */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-2 block">Select Investment Currency</label>
              <div className="relative">
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="w-full md:w-64 bg-[#121212] rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span>{selectedCurrency}</span>
                    <span className="text-gray-400">
                      ({currencies.find(c => c.symbol === selectedCurrency)?.name})
                    </span>
                  </div>
                  <ChevronDown size={20} className="text-gray-400" />
                </button>
                
                {showCurrencyDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full md:w-64 bg-[#121212] rounded-lg shadow-lg z-10">
                    {currencies.map((currency) => (
                      <button
                        key={currency.symbol}
                        onClick={() => {
                          setSelectedCurrency(currency.symbol)
                          setShowCurrencyDropdown(false)
                        }}
                        className="w-full p-3 text-left hover:bg-[#1A1A1A] first:rounded-t-lg last:rounded-b-lg flex items-center justify-between"
                      >
                        <span>{currency.symbol}</span>
                        <span className="text-gray-400">{currency.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Active Investments */}
            <div className="bg-[#121212] rounded-[1rem] p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Investments</h2>
                <button className="text-orange-500 hover:text-orange-600">View History</button>
              </div>
              <div className="space-y-4">
                {activeInvestments.map((investment) => (
                  <div key={investment.id} className="bg-[#1A1A1A] p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{investment.package}</h3>
                        <p className="text-sm text-gray-400">{investment.amount}</p>
                      </div>
                      <div className="text-green-500">{investment.currentProfit}</div>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <div>Start: {investment.startDate}</div>
                      <div>End: {investment.endDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Packages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investmentPackages.map((pkg) => (
                <div key={pkg.id} className="bg-[#121212] rounded-[1rem] p-6 relative overflow-hidden">
                  {pkg.risk === 'Low' && (
                    <div className="absolute top-4 right-4 bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm">
                      Recommended
                    </div>
                  )}
                  
                  <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min Amount</span>
                      <span>{pkg.minAmount[selectedCurrency]} {selectedCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Amount</span>
                      <span>{pkg.maxAmount[selectedCurrency]} {selectedCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expected ROI</span>
                      <span className="text-green-500">{pkg.roi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Risk Level</span>
                      <span className={`
                        ${pkg.risk === 'Low' ? 'text-green-500' : ''}
                        ${pkg.risk === 'Medium' ? 'text-yellow-500' : ''}
                        ${pkg.risk === 'High' ? 'text-red-500' : ''}
                      `}>{pkg.risk}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-2">Features:</h4>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-400 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleInvest(pkg)}
                    className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium"
                  >
                    Invest Now
                  </button>
                </div>
              ))}
            </div>

            {/* Investment Modal */}
            {showConfirm && selectedPackage && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-[#121212] rounded-[1rem] p-6 max-w-md w-full mx-4">
                  <h3 className="text-xl font-semibold mb-4">Confirm Investment</h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm text-gray-400">Amount ({selectedCurrency})</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`${selectedPackage.minAmount[selectedCurrency]} - ${selectedPackage.maxAmount[selectedCurrency]}`}
                        className="mt-1 w-full bg-[#1A1A1A] rounded-lg p-3 text-white"
                        required
                        min={selectedPackage.minAmount[selectedCurrency]}
                        max={selectedPackage.maxAmount[selectedCurrency]}
                        step="any"
                      />
                    </div>
                    <div className="text-sm text-gray-400">
                      <div className="flex justify-between mb-2">
                        <span>Package:</span>
                        <span className="text-white">{selectedPackage.name}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Duration:</span>
                        <span className="text-white">{selectedPackage.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected ROI:</span>
                        <span className="text-green-500">{selectedPackage.roi}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoCompound"
                        checked={autoCompound}
                        onChange={(e) => setAutoCompound(e.target.checked)}
                        className="rounded bg-[#1A1A1A] border-gray-600"
                      />
                      <label htmlFor="autoCompound" className="text-sm text-gray-400">
                        Enable auto-compound
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 bg-[#1A1A1A] hover:bg-[#242424] py-3 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmInvestment}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}