'use client';

import { usePathname } from 'next/navigation';
import LifegroupPICGuard from '@/components/auth/LifegroupPICGuard';

export default function LifegroupLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const pathname = usePathname();
    
    // Routes that should be accessible to everyone (no PIC guard needed)
    const universalAccessRoutes = [
      '/dashboard/lifegroup',          // Main dashboard
      '/dashboard/lifegroup/my-lifegroup'  // My Lifegroup page
    ];
    
    // Check if current route needs PIC guard
    const needsPICGuard = !universalAccessRoutes.includes(pathname);
    
    if (needsPICGuard) {
      return (
        <LifegroupPICGuard>
          {children}
        </LifegroupPICGuard>
      );
    }
    
    // For universal access routes, render children directly without guard
    return <>{children}</>;
  }
  