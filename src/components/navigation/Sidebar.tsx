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

import { dashboardMenu, MenuItem, hasAccess, ADMIN_ROLE } from '@/constant/menu';
import { getUserData, Logout } from '@/lib/helper';

import UserProfile from './UserProfile';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([]);
  const [isMobile, setIsMobile] = React.useState(false);
  const [filteredMenu, setFilteredMenu] = React.useState<MenuItem[]>([]);
  const [userData, setUserData] = React.useState<any>(null);

  React.useEffect(() => {
    const data = getUserData();
    if (data) {
      setUserData(data);
      const userRoles = data.pelayanan.map((p: any) => p.pelayanan.toLowerCase());
      const userPelayanan = data.pelayanan;

      // Filter the menu based on user permissions
      const filterMenu = (menu: MenuItem[]): MenuItem[] => {
        return menu
          .filter(item => hasAccess(item, userRoles, userPelayanan))
          .map(item => {
            if (item.submenu) {
              return { ...item, submenu: filterMenu(item.submenu) };
            }
            return item;
          })
          .filter(item => item.submenu ? item.submenu.length > 0 : true); // Also remove parent if all children are filtered out
      };
      
      setFilteredMenu(filterMenu(dashboardMenu));
    }
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        if (!isMobileOpen) {
          setIsCollapsed(true);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen]);

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
    if (!isMobileOpen && isMobile) {
      setIsCollapsed(false);
    }
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile menu toggle button */}
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

      <div
        className={`fixed md:relative min-h-screen max-h-screen bg-white transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } border-r border-gray-200 z-30 ${
          isMobile
            ? isMobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
            : 'translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className='flex items-center p-4 border-b border-gray-200'>
          <Image
            src='/images/logo.png'
            alt='Every Nation Logo'
            width={isCollapsed ? 40 : 100}
            height={40}
            className='mx-auto'
          />
        </div>

        {/* User Profile */}
        <UserProfile
          isCollapsed={isCollapsed}
          name={userData?.nama || 'User'}
          pelayanan={userData?.pelayanan || []}
          imageUrl={userData?.image_url || '/images/avatar.jpg'}
        />

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='absolute -right-3 top-24 bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50 hidden md:block'
        >
          <FiChevronLeft
            className={`w-4 h-4 transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Menu Section */}
        <div className='py-4 flex-1 flex flex-col h-[calc(100vh-185px)]'>
          <p
            className={`px-4 text-xs font-medium text-gray-400 mb-2 ${
              isCollapsed ? 'text-center' : ''
            }`}
          >
            Menu
          </p>
          <nav className='space-y-1 overflow-y-auto flex-grow pb-16'>
            {filteredMenu.map((item) => (
              <div key={item.title}>
                {item.submenu && item.submenu.length > 0 ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium relative transition-colors duration-200 ${
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
                        <item.icon className='w-5 h-5' />
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
                      {isSubmenuActive(item) && (
                        <div className='absolute right-0 top-0 h-full w-1 bg-primary-600'></div>
                      )}
                    </button>
                    {!isCollapsed && (
                      <div
                        className={`overflow-hidden transition-all duration-200 ease-in-out ${
                          expandedMenus.includes(item.title)
                            ? 'max-h-[500px] opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className='pl-8 space-y-1'>
                          {item.submenu.map((submenu) => (
                            <Link
                              key={submenu.title}
                              href={submenu.href}
                              className={`block px-4 py-2 text-sm font-medium relative transition-colors duration-200 ${
                                isActive(submenu.href)
                                  ? 'text-primary-600 bg-primary-50'
                                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                              }`}
                              onClick={() => isMobile && setIsMobileOpen(false)}
                            >
                              <div className='flex items-center space-x-3'>
                                <submenu.icon className='w-5 h-5' />
                                <span>{submenu.title}</span>
                              </div>
                              {isActive(submenu.href) && (
                                <div className='absolute right-0 top-0 h-full w-1 bg-primary-600'></div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`block px-4 py-2.5 text-sm font-medium relative transition-colors duration-200 ${
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
                      <item.icon className='w-5 h-5' />
                      {!isCollapsed && <span>{item.title}</span>}
                    </div>
                    {isActive(item.href) && (
                      <div className='absolute right-0 top-0 h-full w-1 bg-primary-600'></div>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Settings Section */}
        <div className='absolute bottom-0 w-full border-t border-gray-200 bg-white flex justify-between'>
          <Link
            href='/dashboard/pengaturan'
            className={`flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 relative transition-colors duration-200 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            onClick={() => isMobile && setIsMobileOpen(false)}
          >
            <FiSettings
              className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
            />
            {!isCollapsed && <span>Pengaturan</span>}
            {isActive('/dashboard/pengaturan') && (
              <div className='absolute right-0 top-0 h-full w-1 bg-primary-600'></div>
            )}
          </Link>
          <button
            className={`border-l-[1px] border-gray-200 pl-3`}
            onClick={Logout}
          >
            <FiLogOut
              className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
            ></FiLogOut>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isMobileOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-20'
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
