"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Menu, X } from "lucide-react"
import Logo from "./ui/Logo"

export function Header() {
  const { isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 right-0 bg-[#1a1a1a] md:bg-transparent mt-2 md:mt-0 p-4 md:p-0 space-y-4 md:space-y-0 md:items-center md:space-x-8`}>
            <Link href="/" className="text-white hover:text-gray-300 text-center">
              Home
            </Link>
            <Link href="/dashboard" className="text-white hover:text-gray-300 text-center">
              Wallet
            </Link>
            <Link href="/dashboard" className="text-white hover:text-gray-300 text-center">
              Invest
            </Link>
            <Link href="/dashboard" className="text-white hover:text-gray-300 text-center">
              Trade
            </Link>


            {!isAuthenticated ? (
              <Link href="/register" className="bg-[#f7931a] text-white px-4 py-2 rounded-lg hover:bg-[#f7931a]/90 transition-colors w-full md:w-auto">
                Get Started
              </Link>
            ) : (
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <Link href="/dashboard" className="hover:text-gray-300">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-[#f7931a] text-white px-4 py-2 rounded-lg hover:bg-[#f7931a]/90 transition-colors w-full md:w-auto"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

