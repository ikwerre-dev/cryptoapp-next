import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BarChart3, RefreshCcw, Send, ArrowLeftRight, Bot, Settings } from 'lucide-react';

export function AdminSidebar() {
    const pathname = usePathname();
    
    const links = [
        { href: '/admin', label: 'Dashboard', icon: BarChart3 },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/transactions', label: 'Transactions', icon: RefreshCcw },
        { href: '/admin/investments/', label: 'Investment Plans', icon: Send },
        { href: '/admin/investments/recent', label: 'Recent Investments', icon: Send },
        { href: '/admin/bots', label: 'Bots', icon: Bot },
        { href: '/admin/bots/sessions', label: 'Recent Bots', icon: Bot },
        { href: '/admin/wallets', label: 'Wallet Address', icon: Settings },
    ];

    return (
        <div className="fixed inset-y-0 left-0 w-64 bg-[#121212] border-r border-gray-800">
            <div className="flex flex-col h-full">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                </div>
                <nav className="flex-1 p-4">
                    {links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors mb-1 ${
                                    pathname === link.href 
                                    ? 'bg-orange-500 text-white' 
                                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}