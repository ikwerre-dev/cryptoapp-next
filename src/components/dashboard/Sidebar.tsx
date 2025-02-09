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
    HistoryIcon
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
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: BarChart2, label: 'Portfolio', href: '/dashboard/portfolio' },
        { icon: ChartCandlestickIcon, label: 'AI Trading', href: '/dashboard/Aitrading' },
        { icon: Coins, label: 'Invest', href: '/dashboard/invest' },
        { icon: Wallet, label: 'Send', href: '/dashboard/transactions/send' },
        { icon: Wallet, label: 'Deposit', href: '/dashboard/transactions/deposit' },
        { icon: Wallet, label: 'P2P', href: '/dashboard/transactions/p2p' },
        { icon: Wallet, label: 'Swap', href: '/dashboard/transactions/swap' },
        { icon: HistoryIcon, label: 'Transaction', href: '/dashboard/transactions' },
        { icon: Eye, label: 'Watchlist', href: '/dashboard/watchlist' },
        { icon: UserCircle, label: 'Profile', href: '/dashboard/profile' }

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
                w-[280px] lg:w-64 p-4 lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex items-center justify-between mb-8">
                    <Logo />
                    <button
                        onClick={toggle}
                        className="lg:hidden p-2 text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="space-y-2">
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
                </nav>

                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-lg mt-auto absolute bottom-8 w-[calc(100%-2rem)]"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-gray-800 lg:hidden z-40">
                <div className="flex items-center justify-around h-16">
                    <button
                        onClick={toggle}
                        className="p-2 text-gray-400 hover:text-white flex flex-col items-center justify-center p-2 text-xs"
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