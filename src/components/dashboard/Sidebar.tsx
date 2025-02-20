'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    BarChart2,
    Eye,
    UserCircle,
    Wallet,
    LogOut,
    X,
    ChartCandlestickIcon,
    Coins,
    Home,
    HistoryIcon,
    Headphones
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import Logo from '../ui/Logo';
import { Menu } from 'lucide-react';

export function Sidebar() {
    const { isOpen, toggle } = useSidebar();
    const pathname = usePathname();
    const { logout } = useAuth();
    const menuItems = [
        ...(process.env.NEXT_PUBLIC_SHOW_DASHBOARD !== "false" ? [
            { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' }
        ] : []),
        ...(process.env.NEXT_PUBLIC_SHOW_PORTFOLIO !== "false" ? [
            { icon: BarChart2, label: 'Portfolio', href: '/dashboard/portfolio' }
        ] : []),
        ...(process.env.NEXT_PUBLIC_SHOW_AITRADING !== "false" ? [
            { icon: ChartCandlestickIcon, label: 'AI Trading', href: '/dashboard/Aitrading' }
        ] : []),
        ...(process.env.NEXT_PUBLIC_SHOW_INVEST !== "false" ? [
            { icon: Coins, label: 'Invest', href: '/dashboard/invest' }
        ] : []),
        ...(process.env.NEXT_PUBLIC_SHOW_SEND !== "false" ? [
            { icon: Wallet, label: 'Send', href: '/dashboard/transactions/send' }
        ] : []),
        ...(process.env.NEXT_PUBLIC_SHOW_DEPOSIT !== "false" ? [
            { icon: Wallet, label: 'Deposit', href: '/dashboard/transactions/deposit' }
        ] : []),
        ...(process.env.NEXT_PUBLIC_SHOW_P2P !== "false" ? [ 
            { icon: Wallet, label: 'P2P', href: '/dashboard/transactions/p2p' }
        ] : []),
        ...(process.env.NEXT_PUBLIC_SHOW_SWAP !== "false" ? [ 
            { icon: Wallet, label: 'Swap', href: '/dashboard/transactions/swap' }
        ] : []),
        ...(process.env.NEXT_PUBLIC_SHOW_TRANSACTIONS !== "false" ? [
            { icon: HistoryIcon, label: 'Transaction', href: '/dashboard/transactions' }
        ] : []),
        ...(process.env.NEXT_PUBLIC_SHOW_WATCHLIST !== "false" ? [
            { icon: Eye, label: 'Watchlist', href: '/dashboard/watchlist' }
        ] : []),
        ...(process.env.NEXT_PUBLIC_WIDGET_LINK ? [
            { icon: Headphones, label: 'Support', href: '/dashboard/contact' }
        ] : []),
        ...(process.env.NEXT_PUBLIC_SHOW_PROFILE !== "false" ? [
            { icon: UserCircle, label: 'Profile', href: '/dashboard/profile' }
        ] : [])
    ];
    const mobileMenuItems = [
        { icon: Home, label: 'Home', href: '/dashboard' },
        { icon: BarChart2, label: 'Portfolio', href: '/dashboard/portfolio' },
        { icon: Coins, label: 'Invest', href: '/dashboard/invest' },
        { icon: UserCircle, label: 'Deposit', href: '/dashboard/transactions/deposit' },
    ];

    return (
        <>
            <div className={`
                fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity z-40
                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `} onClick={toggle} />
            <div className={`
                fixed top-0 left-0 h-screen bg-[#121212] z-50 transition-transform duration-300 ease-in-out
                w-[280px] lg:w-64 lg:translate-x-0 overflow-hidden flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex-none p-4">
                    <div className="flex items-center justify-between">
                        <Logo />
                        <button
                            onClick={toggle}
                            className="lg:hidden p-2 text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <div className="space-y-2 pb-20">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={toggle}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                                ${pathname === item.href || (item.href !== '/dashboard' && item.href !== '/dashboard/transactions' && pathname?.startsWith(item.href))
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className="flex-none p-4 mt-auto">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-lg w-full"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-gray-800 lg:hidden z-40">
                <div className="flex items-center justify-around h-16">
                    <button
                        onClick={toggle}
                        className=" text-gray-400 hover:text-white flex flex-col items-center justify-center p-2 text-xs"
                    >
                        <Menu size={24} />
                        <span className="mt-1">Menu</span>

                    </button>
                    {mobileMenuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center p-2 text-xs
                                ${pathname === item.href
                                    ? 'text-orange-500'
                                    : 'text-gray-400 hover:text-white'}`}
                        >
                            <item.icon size={20} />
                            <span className="mt-1">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}