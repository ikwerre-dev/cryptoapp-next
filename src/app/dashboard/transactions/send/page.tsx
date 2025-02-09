"use client"

import { use, useEffect, useMemo, useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { ChevronDown } from 'lucide-react'
import * as Select from "@radix-ui/react-select"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useUserData } from "@/hooks/useUserData"
import { useCryptoData } from "@/hooks/useCryptoData"
import { getCryptoName } from "@/lib/getCryptoName"

export default function SendPage({ searchParams }: { searchParams: Promise<{ symbol: string }> }) {
    const router = useRouter()
    const { userData, isLoading, refetch } = useUserData()
    const { cryptoData } = useCryptoData()
    const resolvedParams = use(searchParams)
    const [amount, setAmount] = useState("")
    const [isUSD, setIsUSD] = useState(false)
    const [address, setAddress] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    console.log(cryptoData)
    const availableCoins = useMemo(() => {
        if (!userData?.user || !cryptoData) return []

        return Object.entries(userData.user)
        
            .filter(([key]) => key.endsWith("_balance"))
            .map(([key, balance]) => {
                const symbol = key.replace("_balance", "").toUpperCase()
                const cryptosymbol = getCryptoName(symbol, "lowercase-hyphen");
                const priceUsd = cryptoData[cryptosymbol]?.priceUsd || 0
                const name = cryptoData[symbol.toLowerCase()]?.name || symbol
                return {
                    symbol,
                    name,
                    balance: Number(balance || 0),
                    priceUsd: Number(priceUsd),
                    gasFee: Number((1 / Number(priceUsd || 1)).toFixed(8)),
                }
            })
            .filter((coin) => coin.balance > 0)
    }, [userData, cryptoData])

    const [selectedCrypto, setSelectedCrypto] = useState(
        availableCoins.find((c) => c.symbol === resolvedParams.symbol) || availableCoins[0],
    )

    useEffect(() => {
        if (availableCoins.length > 0) {
            setSelectedCrypto(availableCoins.find((c) => c.symbol === resolvedParams.symbol) || availableCoins[0])
        }
    }, [availableCoins, resolvedParams.symbol])

    // Update conversion calculations
    const cryptoAmount = isUSD ? Number(amount) / (selectedCrypto?.priceUsd || 1) : Number(amount)
    const usdAmount = isUSD ? Number(amount) : Number(amount) * (selectedCrypto?.priceUsd || 1)

    // Update the conversion display
    const conversionDisplay = amount && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
            ≈ {isUSD ? `${cryptoAmount.toFixed(8)} ${selectedCrypto?.symbol}` : `$${usdAmount.toFixed(2)}`}
        </div>
    )

    // Update the total calculation
    const gasPrice = selectedCrypto ? `${selectedCrypto.gasFee} ${selectedCrypto.symbol}` : "0"
    const total =
        selectedCrypto && cryptoAmount
            ? `${(cryptoAmount + selectedCrypto.gasFee).toFixed(8)} ${selectedCrypto.symbol}`
            : "0"
    const totalUsd = selectedCrypto && cryptoAmount
        ? `${((cryptoAmount + selectedCrypto.gasFee) * selectedCrypto.priceUsd).toFixed(2)}`
        : "0.00"




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        if (!selectedCrypto) {
            setError("Please select a cryptocurrency")
            setIsSubmitting(false)
            return
        }

        const totalAmount = cryptoAmount + selectedCrypto.gasFee
        if (totalAmount > selectedCrypto.balance) {
            setError(`Insufficient ${selectedCrypto.symbol} balance`)
            setIsSubmitting(false)
            return
        }

        try {
            const token = Cookies.get("auth-token")
            const response = await fetch("/api/transactions/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: totalUsd,
                    currency: selectedCrypto.symbol,
                    address: address,
                    gasFee: selectedCrypto.gasFee,
                    totalUsd: (totalUsd)
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Transaction failed")
            }

            await refetch()
            router.push(
                `/dashboard/transactions/success?amount=${totalUsd}&symbol=${selectedCrypto.symbol}&type=send&to=${address}`,
            )
        } catch (error) {
            setError(error instanceof Error ? error.message : "Transaction failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white pb-[5rem]">
            <div className="flex flex-col lg:flex-row">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                    <TopBar title="Send" notices={userData?.notices} />
                    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
                        <div className="bg-[#121212] rounded-[1rem] p-6">
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">{error}</div>
                            )}

                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Send {selectedCrypto?.name}</h2>
                                <Select.Root
                                    value={selectedCrypto?.symbol}
                                    onValueChange={(value) => {
                                        const crypto = availableCoins.find((c) => c.symbol === value)
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
                                                {availableCoins.map((crypto) => (
                                                    <Select.Item
                                                        key={crypto.symbol}
                                                        value={crypto.symbol}
                                                        className="flex items-center px-3 py-2 hover:bg-[#242424] rounded cursor-pointer"
                                                    >
                                                        <Select.ItemText>
                                                            {crypto.symbol} ($
                                                            {(crypto.balance).toLocaleString("en-US", {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })}
                                                            )
                                                        </Select.ItemText>
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
                                                className={`px-3 py-1 rounded text-sm ${!isUSD ? "bg-orange-500" : "hover:bg-[#242424]"}`}
                                            >
                                                {selectedCrypto?.symbol}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsUSD(true)}
                                                className={`px-3 py-1 rounded text-sm ${isUSD ? "bg-orange-500" : "hover:bg-[#242424]"}`}
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
                                        {conversionDisplay}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-gray-400">Recipient Address</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="mt-2 w-full bg-[#1A1A1A] rounded-lg p-3 text-white"
                                        placeholder={`Enter ${selectedCrypto?.symbol} address`}
                                        required
                                    />
                                </div>

                                <div className="bg-[#1A1A1A] p-4 rounded-lg space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Gas Fee</span>
                                        <span>{Number(gasPrice.split(' ')[0]).toFixed(6)} {selectedCrypto?.symbol}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Total</span>
                                        <span>{total}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Total USD</span>
                                        <span>${totalUsd}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? "Processing..." : `Send ${selectedCrypto?.symbol}`}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
