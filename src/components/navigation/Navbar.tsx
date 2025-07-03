'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

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
    <header className='sticky top-0 bg-background/80 backdrop-blur-md z-50 border-b border-border/80'>
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
          <nav className='hidden md:flex items-center space-x-2'>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === item.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
             <Button asChild>
                <Link href='/login'>Masuk</Link>
             </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden p-2 rounded-md text-muted-foreground hover:text-primary'
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className='sr-only'>Buka menu</span>
            {isOpen ? <X className="h-6 w-6"/> : <Menu className='h-6 w-6'/>}
          </button>
        </div>
      </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className='md:hidden border-t border-border bg-background'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="px-2 pb-3">
              <Button asChild className="w-full">
                <Link href='/login' onClick={() => setIsOpen(false)}>
                    Masuk
                </Link>
              </Button>
            </div>
          </div>
        )}
    </header>
  );
}
