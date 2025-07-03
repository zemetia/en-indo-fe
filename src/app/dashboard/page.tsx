'use client';

import Link from 'next/link';
import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

import { dashboardMenu, MenuItem, ADMIN_ROLE } from '@/constant/menu';
import { getUserData } from '@/lib/helper';

export default function DashboardPage() {
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userPelayanan, setUserPelayanan] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Kategori menu
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

  // Fungsi untuk memeriksa apakah user memiliki akses ke menu berdasarkan PIC status
  const hasAccess = useCallback(
    (menu: MenuItem) => {
      // Admin punya akses ke semua
      if (userRoles.includes(ADMIN_ROLE)) return true;

      // Periksa apakah user memiliki satu dari roles yang diperlukan
      const hasRole =
        menu.permissions.includes('*') ||
        menu.permissions.some((permission) => userRoles.includes(permission));

      // Jika menu tidak memerlukan PIC, cukup periksa role
      if (!menu.requirePIC) return hasRole;

      // Jika menu memerlukan PIC, periksa apakah user adalah PIC di salah satu pelayanan yang relevan
      if (hasRole && menu.requirePIC) {
        return userPelayanan.some(
          (p) =>
            menu.permissions.includes(p.pelayanan.toLowerCase()) && p.is_pic
        );
      }

      return false;
    },
    [userRoles, userPelayanan]
  );

  // Get user data and filter menu
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      const roles = userData.pelayanan.map((p: any) =>
        p.pelayanan.toLowerCase()
      );
      setUserRoles(roles);
      setUserPelayanan(userData.pelayanan);

      // Filter menu berdasarkan izin dan status PIC
      if (roles.includes(ADMIN_ROLE)) {
        // Admin dapat akses semua menu
        setFilteredMenu(dashboardMenu);
      } else {
        // Memfilter menu berdasarkan izin pengguna dan status PIC
        const filtered = dashboardMenu.filter((menu) => hasAccess(menu));
        setFilteredMenu(filtered);
      }
    }
  }, [hasAccess]);

  // Filter menu berdasarkan pencarian
  const searchFilteredMenu = filteredMenu.filter(
    (menu) =>
      menu.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Kelompokkan menu berdasarkan kategori
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

  return (
    <div className='space-y-6'>
      {/* Featured Card */}
      <FeaturedCard
        title='Every Nation Portal'
        description='Selamat datang di Dashboard Admin Every Nation Indonesia'
        actionLabel='Jelajahi sekarang'
        gradientFrom='from-orange-500'
        gradientTo='to-red-500'
      />

      {/* Search Bar */}
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

      {/* Menu Grid by Category */}
      {Object.entries(groupedMenu).map(([key, category]) => (
        <div key={key} className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-900'>
            {category.title}
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
            {category.items.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className='group block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1'
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
