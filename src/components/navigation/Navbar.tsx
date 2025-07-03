'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

const menuItems = [
  { name: 'Beranda', href: '/' },
  { name: 'Tentang Kami', href: '/about' },
  { name: 'Pelayanan', href: '/services' },
  { name: 'Kontak', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className='fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-200'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-20'>
          {/* Logo */}
          <Link href='/' className='flex items-center py-2'>
            <Image
              src='/images/logo.png'
              alt='Every Nation Indonesia'
              width={140}
              height={37}
              className='h-9 w-auto'
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <nav className='hidden md:flex items-center space-x-2'>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-100'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
             <Link
              href='/login'
              className='inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors'
            >
              Masuk
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none'
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className='sr-only'>Buka menu</span>
            <svg
              className='h-6 w-6'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              {isOpen ? (
                <path d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>
      </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className='md:hidden border-t border-gray-100 bg-white'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="px-2 pb-3">
              <Link
                href='/login'
                className='block w-full px-3 py-3 text-center text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors'
                onClick={() => setIsOpen(false)}
              >
                Masuk
              </Link>
            </div>
          </div>
        )}
    </header>
  );
}
