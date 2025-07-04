'use client';

import Link from 'next/link';
import * as React from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dashboardMenu, MenuItem, hasAccess, ADMIN_ROLE } from '@/constant/menu';
import FeaturedCard from '@/components/dashboard/FeaturedCard';
import Skeleton from '@/components/Skeleton';

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
    jemaat: {
      title: 'Manajemen Jemaat',
      items: ['jemaat', 'life-group', 'lifegroup'],
    },
    event: {
      title: 'Manajemen Event',
      items: ['event'],
    },
    pelayanan: {
      title: 'Manajemen Pelayanan',
      items: ['pelayanan', 'musik'],
    },
    sistem: {
      title: 'Manajemen Sistem',
      items: ['role'],
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
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Every Nation Portal'
        description='Selamat datang di Dashboard Admin Every Nation Indonesia'
        actionLabel='Jelajahi sekarang'
        gradientFrom='from-orange-500'
        gradientTo='to-red-500'
      />

      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Search className='h-5 w-5 text-gray-400' />
        </div>
        <input
          type='text'
          className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm'
          placeholder='Cari menu...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {Object.entries(groupedMenu).map(([key, category]) => (
        <div key={key} className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-900'>
            {category.title}
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {category.items.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className='group block p-6 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-blue-500 hover:-translate-y-1'
              >
                <div
                  className={`inline-block p-3 rounded-lg ${card.color} transition-transform group-hover:scale-110`}
                >
                  <card.icon className='w-6 h-6 text-white' />
                </div>
                <h3 className='mt-4 text-lg font-medium text-gray-900'>
                  {card.title}
                </h3>
                <p className='mt-1 text-sm text-gray-600'>{card.description}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
