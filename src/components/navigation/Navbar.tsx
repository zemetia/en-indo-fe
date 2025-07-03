'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { name: 'Beranda', href: '/' },
  { name: 'Tentang Kami', href: '/about' },
  { name: 'Pelayanan', href: '/services' },
  { name: 'Kontak', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasScrolled, setHasScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${hasScrolled ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200' : 'bg-transparent'}`}>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-20'>
          {/* Logo */}
          <Link href='/' className='flex items-center'>
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
          <nav className='hidden md:flex items-center space-x-2 bg-gray-100/50 border border-gray-200/80 p-1 rounded-full shadow-sm'>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-blue-600'
                    : `text-gray-700 hover:text-blue-600`
                }`}
              >
                {item.name}
                {pathname === item.href && (
                   <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      layoutId="underline"
                      />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
             <Button asChild className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">
                <Link href='/login'>Masuk</Link>
             </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden p-2 rounded-md text-gray-500 hover:text-blue-600 z-50'
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className='sr-only'>Buka menu</span>
            {isOpen ? <X className="h-6 w-6"/> : <Menu className='h-6 w-6'/>}
          </button>
        </div>
      </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='md:hidden absolute top-0 left-0 w-full h-screen bg-white border-t border-gray-200 pt-20'
          >
            <div className='px-4 pt-2 pb-3 space-y-2'>
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-800 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="px-4 pt-4">
              <Button asChild className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300" size="lg">
                <Link href='/login' onClick={() => setIsOpen(false)}>
                    Masuk
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
    </header>
  );
}
