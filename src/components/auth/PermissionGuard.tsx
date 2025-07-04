'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUserData } from '@/lib/helper';
import { hasAccess, dashboardMenu, MenuItem } from '@/constant/menu';

interface PermissionGuardProps {
  children: ReactNode;
}

// Helper function to find the menu item configuration for a given path
const findMenuItemConfig = (
  path: string,
  menu: MenuItem[]
): MenuItem | null => {
  for (const item of menu) {
    // Exact match
    if (item.href === path) {
      return item;
    }
    // Handle dynamic routes like /dashboard/jemaat/[id]
    const baseHref = item.href.split('/[')[0];
    if (path.startsWith(baseHref) && item.href.includes('[')) {
      return item;
    }
    // Recursive search for submenus
    if (item.submenu) {
      const foundInSubmenu = findMenuItemConfig(path, item.submenu);
      if (foundInSubmenu) {
        return foundInSubmenu;
      }
    }
  }
  return null;
};

export default function PermissionGuard({ children }: PermissionGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = getUserData();

    // If no user data, redirect to login immediately.
    if (!userData) {
      router.replace('/login');
      return; // Stop further execution
    }

    const userRoles = userData.pelayanan.map((p: any) =>
      p.pelayanan.toLowerCase()
    );
    const userPelayanan = userData.pelayanan;

    // Find the menu item that matches the current path
    const menuItem = findMenuItemConfig(pathname, dashboardMenu);
    
    let authorized = false;
    if (menuItem) {
      // Check permission using the centralized hasAccess function
      authorized = hasAccess(menuItem, userRoles, userPelayanan);
    } else if (pathname === '/dashboard') {
      // The main dashboard page is always accessible if logged in
      authorized = true;
    }
    
    if (authorized) {
      setIsAuthorized(true);
    } else {
      // If not authorized, redirect to 404 page
      router.replace('/not-found');
    }

    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600'></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
