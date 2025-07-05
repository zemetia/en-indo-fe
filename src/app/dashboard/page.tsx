'use client';

import Link from 'next/link';
import * as React from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dashboardMenu, MenuItem, hasAccess, ADMIN_ROLE } from '@/constant/menu';
import FeaturedCard from '@/components/dashboard/FeaturedCard';
import Skeleton from '@/components/Skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredMenu = React.useMemo(() => {
    if (!user) return [];
    
    const userRoles = user.pelayanan.map((p: any) => p.pelayanan.toLowerCase());
    
    // Admin gets all menus
    if (userRoles.includes(ADMIN_ROLE)) {
      return dashboardMenu;
    }
    
    // Filter based on permissions
    return dashboardMenu.filter((menu) => hasAccess(menu, userRoles, user.pelayanan));
  }, [user]);

  const searchFilteredMenu = filteredMenu.filter(
    (menu) =>
      menu.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = {
    utama: {
      title: 'Menu Utama',
      items: ['/dashboard', 'jadwal-saya', 'ketersediaan'],
    },
    jemaat: {
      title: 'Manajemen Jemaat & Komunitas',
      items: ['jemaat', 'lifegroup', 'pemuridan'],
    },
    pelayanan: {
      title: 'Manajemen Pelayanan & Acara',
      items: ['event', 'musik', 'pelayanan', 'attendance'],
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
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/4 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <FeaturedCard
        title={`Selamat Datang, ${user?.nama || 'Pengguna'}!`}
        description='Kelola semua aspek pelayanan gereja dari satu tempat terpusat.'
        actionLabel='Lihat Profil Saya'
        gradientFrom='from-blue-500'
        gradientTo='to-indigo-500'
      />

      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Search className='h-5 w-5 text-gray-400' />
        </div>
        <input
          type='text'
          className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
          placeholder='Cari menu...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {Object.entries(groupedMenu).map(([key, category]) => (
        <div key={key} className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800 border-b pb-2'>
            {category.title}
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {category.items.map((card) => (
              <Link key={card.href} href={card.href} className="group block h-full">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 flex flex-col border-gray-200">
                    <CardHeader className="flex-grow">
                        <div className={`mb-4 inline-block p-3 rounded-lg ${card.color} transition-transform group-hover:scale-110`}>
                            <card.icon className='w-6 h-6 text-white' />
                        </div>
                        <CardTitle>{card.title}</CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-end items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Akses Menu <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                    </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
