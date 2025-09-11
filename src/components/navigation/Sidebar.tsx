'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { dashboardMenu, MenuItem } from '@/constant/menu';
import UserProfile from './UserProfile';
import Skeleton from '@/components/Skeleton';

export default function Sidebar() {
  const { user, isLoading, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([]);
  const [isMobile, setIsMobile] = React.useState(false);
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
    
    // Only run resize logic on client after mount
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      } else {
        setIsMobileOpen(false);
      }
    };

    // Initial setup
    handleResize();
    
    // Add event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  React.useEffect(() => {
    // Open the parent menu of the active submenu item on initial load or path change
    const activeMenuItem = dashboardMenu.find(item => isSubmenuActive(item));
    if (activeMenuItem && !expandedMenus.includes(activeMenuItem.title)) {
      setExpandedMenus(prev => [...prev, activeMenuItem.title]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isSubmenuActive = (item: MenuItem) => {
    if (!item.submenu) return false;
    return item.submenu.some((submenu) => pathname.startsWith(submenu.href));
  };

  const toggleMobileMenu = () => {
    if (isMobile) {
      // When opening (isMobileOpen is false), set collapsed to false.
      // When closing (isMobileOpen is true), set collapsed to true.
      setIsCollapsed(isMobileOpen);
    }
    setIsMobileOpen(!isMobileOpen);
  };

  const renderSkeleton = () => (
    <div className='p-4 space-y-4'>
      <div className='flex items-center space-x-3'>
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className='flex-1 space-y-2'>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );

  // Don't render until hydrated to prevent hydration mismatch
  if (!hasMounted) {
    return (
      <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
        <div className='flex items-center p-4 border-b border-gray-200 flex-shrink-0'>
          <Image
            src='/images/logo.png'
            alt='Every Nation Logo'
            width={100}
            height={40}
            className='mx-auto'
          />
        </div>
        {renderSkeleton()}
      </aside>
    );
  }

  return (
    <>
      <div className='md:hidden fixed top-4 left-4 z-50'>
        <button
          onClick={toggleMobileMenu}
          className='p-2 rounded-md bg-white shadow-md'
        >
          {isMobileOpen ? (
            <FiX className='w-6 h-6 text-gray-700' />
          ) : (
            <FiMenu className='w-6 h-6 text-gray-700' />
          )}
        </button>
      </div>

      <aside
        className={`fixed md:relative h-screen bg-white transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } border-r border-gray-200 z-30 flex flex-col ${
          isMobile
            ? isMobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
            : 'translate-x-0'
        } md:translate-x-0`}
      >
        <div className='flex items-center p-4 border-b border-gray-200 flex-shrink-0'>
          <Image
            src='/images/logo.png'
            alt='Every Nation Logo'
            width={isCollapsed ? 40 : 100}
            height={40}
            className='mx-auto'
          />
        </div>

        {isLoading ? (
           <div className="p-4 border-b border-gray-200 flex-shrink-0">
             <div className="flex items-center space-x-3">
               <Skeleton className="h-10 w-10 rounded-full" />
               {!isCollapsed && (
                 <div className="flex-1 space-y-2">
                   <Skeleton className="h-4 w-3/4" />
                   <Skeleton className="h-3 w-1/2" />
                 </div>
               )}
             </div>
           </div>
        ) : user && (
          <div className="flex-shrink-0">
            <UserProfile
              isCollapsed={isCollapsed}
              name={user.nama}
              pelayanan={user.pelayanan}
              imageUrl={user.image_url || '/images/avatar.jpg'}
            />
          </div>
        )}

        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='absolute -right-3 top-24 bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50 z-40'
          >
            <FiChevronLeft
              className={`w-4 h-4 transition-transform ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}

        <div className='flex-1 flex flex-col overflow-y-auto py-4'>
          <p
            className={`px-4 text-xs font-medium text-gray-400 mb-2 ${
              isCollapsed ? 'text-center' : ''
            }`}
          >
            Menu
          </p>
          <nav className='flex-1 space-y-1 px-2'>
            {isLoading ? renderSkeleton() : dashboardMenu.map((item) => (
              <div key={item.title}>
                {item.submenu && item.submenu.length > 0 ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={`w-full flex items-center justify-between px-2 py-2.5 text-sm font-medium rounded-lg relative transition-colors duration-200 ${
                        isSubmenuActive(item)
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`flex items-center ${
                          isCollapsed ? 'w-full justify-center' : 'space-x-3'
                        }`}
                      >
                        <item.icon className='w-5 h-5 flex-shrink-0' />
                        {!isCollapsed && <span>{item.title}</span>}
                      </div>
                      {!isCollapsed && (
                        <div className='transition-transform duration-200'>
                          {expandedMenus.includes(item.title) ? (
                            <FiChevronDown className='w-4 h-4' />
                          ) : (
                            <FiChevronRight className='w-4 h-4' />
                          )}
                        </div>
                      )}
                    </button>
                    {!isCollapsed && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          expandedMenus.includes(item.title)
                            ? 'max-h-[500px] opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className='pl-4 mt-1 space-y-1'>
                          {item.submenu.map((submenu) => (
                            <Link
                              key={submenu.title}
                              href={submenu.href}
                              className={`block px-2 py-2 text-sm font-medium rounded-lg relative transition-colors duration-200 ${
                                isActive(submenu.href)
                                  ? 'text-primary-600 bg-primary-100/50'
                                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                              }`}
                              onClick={() => isMobile && setIsMobileOpen(false)}
                            >
                              <div className='flex items-center space-x-3'>
                                <submenu.icon className='w-5 h-5 flex-shrink-0' />
                                <span>{submenu.title}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`block px-2 py-2.5 text-sm font-medium rounded-lg relative transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    onClick={() => isMobile && setIsMobileOpen(false)}
                  >
                    <div
                      className={`flex items-center ${
                        isCollapsed ? 'w-full justify-center' : 'space-x-3'
                      }`}
                    >
                      <item.icon className='w-5 h-5 flex-shrink-0' />
                      {!isCollapsed && <span>{item.title}</span>}
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className='border-t border-gray-200 bg-white flex flex-shrink-0'>
          <Link
            href='/dashboard/settings'
            className={`flex-1 flex items-center py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 relative transition-colors duration-200 ${
              isCollapsed ? 'justify-center px-2' : 'px-4'
            }`}
            onClick={() => isMobile && setIsMobileOpen(false)}
          >
            <FiSettings
              className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`}
            />
            {!isCollapsed && <span>Pengaturan</span>}
          </Link>
          <button
            className={`flex-1 flex items-center py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 border-l border-gray-200 transition-colors duration-200 ${
              isCollapsed ? 'justify-center px-2' : 'px-4'
            }`}
            onClick={logout}
          >
            <FiLogOut
              className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`}
            />
            {!isCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {isMobile && isMobileOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden'
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
