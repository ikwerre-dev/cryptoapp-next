"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Menu, X } from "lucide-react"

const Logo = () => (
  <div className="flex items-center space-x-2">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
        fill="#8B5CF6"
      />
      <path
        d="M22 16C22 19.3137 19.3137 22 16 22C12.6863 22 10 19.3137 10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16Z"
        fill="white"
      />
    </svg>
    <span className="text-xl font-bold">EXCrypto</span>
  </div>
)

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
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop & Mobile Menu */}
          <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 right-0 bg-[#1a1a1a] md:bg-transparent mt-2 md:mt-0 p-4 md:p-0 space-y-4 md:space-y-0 md:items-center md:space-x-8`}>
            <Link href="/marketplace" className="hover:text-gray-300 text-center">
              Marketplace
            </Link>
            <Link href="/feature" className="hover:text-gray-300 text-center">
              Feature
            </Link>
            <Link href="/exchange" className="hover:text-gray-300 text-center">
              Exchange
            </Link>
            <Link href="/activity" className="hover:text-gray-300 text-center">
              Activity
            </Link>
            
            {!isAuthenticated ? (
              <button className="bg-[#f7931a] text-white px-4 py-2 rounded-lg hover:bg-[#f7931a]/90 transition-colors w-full md:w-auto">
              Get Started
              </button>
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

