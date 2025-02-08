'use client';

import { Bell, Menu, Search } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';

interface TopBarProps {
    title: string;
}

export function TopBar({ title }: TopBarProps) {
    const { toggle } = useSidebar();

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
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-white/5 rounded-lg relative">
                        <Bell size={20} className="text-gray-400" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#8B5CF6] rounded-full"></div>
                        <span className="hidden sm:inline-block text-sm font-medium">Alexim</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
