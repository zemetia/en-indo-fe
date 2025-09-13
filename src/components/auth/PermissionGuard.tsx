'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { hasAccess, dashboardMenu, MenuItem } from '@/constant/menu';

const findMenuItemConfig = (
  path: string,
  menu: MenuItem[]
): MenuItem | null => {
  for (const item of menu) {
    if (item.href === path) {
      return item;
    }
    const baseHref = item.href.split('/[')[0];
    if (path.startsWith(baseHref) && item.href.includes('[')) {
      return item;
    }
    if (item.submenu) {
      const foundInSubmenu = findMenuItemConfig(path, item.submenu);
      if (foundInSubmenu) {
        return foundInSubmenu;
      }
    }
  }
  return null;
};

export default function PermissionGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) {
      return; // Wait for user data to be loaded
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    const userRoles = user.pelayanan.map((p: any) =>
      p.pelayanan.toLowerCase()
    );

    const menuItem = findMenuItemConfig(pathname, dashboardMenu);
    
    let authorized = false;
    if (menuItem) {
      authorized = hasAccess(menuItem, userRoles, user.pelayanan);
    } else if (pathname === '/dashboard') {
      authorized = true; // Main dashboard is always accessible if logged in
    }

    if (authorized) {
      setIsAuthorized(true);
    } else {
      router.replace('/not-found');
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600'></div>
      </div>
    );
  }

  return <>{children}</>;
}
