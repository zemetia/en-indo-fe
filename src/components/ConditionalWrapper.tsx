'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';

interface ConditionalWrapperProps {
  children: React.ReactNode;
}

export default function ConditionalWrapper({ children }: ConditionalWrapperProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main>
        {children}
      </main>
    );
  }

  const isDashboard = pathname?.startsWith('/dashboard');
  const isLogin = pathname === '/login';
  const shouldShowNavAndFooter = !isDashboard && !isLogin;

  return (
    <>
      {shouldShowNavAndFooter && <Navbar />}
      <main>
        {children}
      </main>
      {shouldShowNavAndFooter && <Footer />}
    </>
  );
}