'use client';

import Link from 'next/link';
import * as React from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dashboardMenu, MenuItem } from '@/constant/menu';
import Skeleton from '@/components/Skeleton';
import { Input } from '@/components/ui/input';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    document.title = 'Dashboard - Every Nation Indonesia';
  }, []);

  const filteredMenu = React.useMemo(() => {
    if (!user) return [];
    // For development, show all menus. In production, permission checks should be enabled.
    return dashboardMenu;
  }, [user]);

  const searchFilteredMenu = filteredMenu.filter(
    (menu) =>
      menu.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = {
    utama: {
      title: 'Menu Utama',
      items: ['/dashboard', 'jadwal-saya', 'ketersediaan', 'attendance'],
    },
    jemaat: {
      title: 'Manajemen Jemaat & Komunitas',
      items: ['jemaat', 'lifegroup', 'pemuridan'],
    },
    pelayanan: {
      title: 'Manajemen Pelayanan & Acara',
      items: ['event', 'musik', 'pelayanan'],
    },
  };

  const groupedMenu = Object.entries(categories).reduce(
    (acc, [key, category]) => {
      const categoryItems = searchFilteredMenu.filter((menu) =>
        category.items.some((item) => menu.href.includes(item))
      );
      if (categoryItems.length > 0) {
        acc[key] = {
          title: category.title,
          items: categoryItems,
        };
      }
      return acc;
    },
    {} as Record<string, { title: string; items: MenuItem[] }>
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-1/3 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
        
        <div className="space-y-4 pt-4">
            <Skeleton className="h-7 w-1/4 rounded-lg" />
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
              {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center p-3">
                      <Skeleton className="w-16 h-16 rounded-xl mr-4" />
                      <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                      </div>
                  </div>
              ))}
            </div>
        </div>
        <div className="space-y-4 pt-4">
            <Skeleton className="h-7 w-1/4 rounded-lg" />
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
              {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center p-3">
                      <Skeleton className="w-16 h-16 rounded-xl mr-4" />
                      <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                      </div>
                  </div>
              ))}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-10'>
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Aplikasi & Layanan</h1>
            <p className="text-gray-500 mt-1">Akses semua fitur dan layanan yang Anda butuhkan di sini.</p>
        </div>
        
        <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
            <Input
                type='text'
                className='w-full pl-10 pr-4 py-2 text-base h-12 bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400'
                placeholder='Cari menu atau layanan...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        {Object.entries(groupedMenu).length > 0 ? (
        Object.entries(groupedMenu).map(([key, category]) => (
            <div key={key} className='space-y-4'>
            <h2 className='text-xl font-semibold text-gray-800'>
                {category.title}
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-2'>
                {category.items.map((card) => (
                <Link
                    key={card.href}
                    href={card.href}
                    className="group flex items-center p-3 rounded-xl transition-colors hover:bg-gray-100"
                >
                    <div className={`flex-shrink-0 p-3 rounded-lg ${card.color} mr-4`}>
                    <card.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">{card.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{card.description}</p>
                    </div>
                </Link>
                ))}
            </div>
            </div>
        ))
        ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
            <Search className="mx-auto h-12 w-12 text-gray-400"/>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada menu ditemukan</h3>
            <p className="mt-1 text-sm text-gray-500">Coba kata kunci lain untuk mencari menu yang Anda inginkan.</p>
        </div>
        )}
    </div>
  );
}
