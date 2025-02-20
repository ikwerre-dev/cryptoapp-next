'use client';

import { Bell, Menu, Search } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/hooks/useUserData';

interface TopBarProps {
    title: string;
    notices?: {
        id: number;
        type: 'security' | 'transaction' | 'kyc' | 'system' | 'promotion';
        title: string;
        message: string;
        is_read: boolean;
        created_at: string;
    }[];
}

export function TopBar({ title, notices = [] }: TopBarProps) {
    const router = useRouter();
    const { toggle } = useSidebar();
    const [isOpen, setIsOpen] = useState(false);
    const [showNotices, setShowNotices] = useState(false);
    const { logout, markNoticesAsRead } = useAuth();
    const { userData ,refetch } = useUserData()


    const handleRefetch = useCallback(async () => {
         await refetch()
        }, [refetch])
    
     
    
      useEffect(() => {
        const interval = setInterval(() => {
          handleRefetch();
        }, 5000)
    
        return () => clearInterval(interval)
      }, [])
    

    const unreadCount = notices?.filter(notice => !notice.is_read).length || 0;

    const handleNoticesOpen = () => {
        setShowNotices(!showNotices);
        if (!showNotices && unreadCount > 0) {
            const unreadNoticeIds = notices
                .filter(notice => !notice.is_read)
                .map(notice => notice.id);
            markNoticesAsRead(unreadNoticeIds);
        }
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
            router.push(`/dashboard/watchlist?search=${encodeURIComponent(e.currentTarget.value.trim())}`);
            e.currentTarget.value = '';
        }
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-800/50 bg-[#0A0A0A]/80 backdrop-blur">
            <div className="flex-1 flex items-center justify-between px-3 lg:px-6">
                <div className="flex items-center gap-4 lg:gap-8">
                    <button
                        onClick={toggle}
                        className="lg:hidden p-2 hover:bg-white/5 rounded-lg"
                    >
                        <Menu size={24} className="text-gray-400" />
                    </button>
                    <h1 className="text-lg lg:text-xl font-bold">{title}</h1>
                    <div className="hidden md:block relative w-64 lg:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search your coins..."
                            className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] rounded-lg border border-gray-800 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] text-white placeholder-gray-400 outline-none"
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button
                            onClick={handleNoticesOpen}
                            className="p-2 hover:bg-white/5 rounded-lg relative"
                        >
                            <Bell size={20} className="text-gray-400" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotices && notices && notices.length > 0 && (
                            <div className="fixed left-4 right-4 lg:absolute lg:left-auto lg:right-0 mt-2 w-auto lg:w-80 rounded-lg bg-[#1A1A1A] border border-gray-800 shadow-lg max-h-[400px] overflow-y-auto">
                                <div className="py-2">
                                    <div className="px-4 py-2 border-b border-gray-800">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-medium">Notifications</h3>
                                            <span className="text-xs text-gray-400">{unreadCount} unread</span>
                                        </div>
                                    </div>
                                    {notices.map((notice) => (
                                        <div
                                            key={notice.id}
                                            className={`px-4 py-3 hover:bg-white/5 cursor-pointer ${!notice.is_read ? 'bg-purple-500/10' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 w-2 h-2 rounded-full ${!notice.is_read ? 'bg-purple-500' : 'bg-gray-500'
                                                    }`} />
                                                <div>
                                                    <div className="font-medium text-sm">{notice.title}</div>
                                                    <p className="text-sm text-gray-400 mt-1">{notice.message}</p>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {new Date(notice.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="sticky bottom-0 w-full bg-[#1A1A1A] border-t border-gray-800 p-2">
                                        <Link 
                                            href="/dashboard/notifications" 
                                            className="block w-full text-center py-2 text-sm text-purple-500 hover:text-purple-400 font-medium"
                                            onClick={() => setShowNotices(false)}
                                        >
                                            View All Notifications
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded-lg"
                        >
                            <span className="hidden sm:inline-block text-sm font-medium px-1">{userData?.user.first_name}</span>
                            <div className="w-8 h-8 bg-[#8B5CF6] rounded-full"></div>
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#1A1A1A] border border-gray-800 shadow-lg">
                                <div className="py-1">
                                    <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                                        Profile
                                    </Link>
                                    <Link href="/dashboard/portfolio" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                                        Portfolio
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
