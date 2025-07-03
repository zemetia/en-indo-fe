'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUserData } from '@/lib/helper';
import { permissionMap, ADMIN_ROLE } from '@/constant/menu';

interface PermissionGuardProps {
  children: ReactNode;
}

// Fungsi untuk memeriksa apakah memiliki izin
const hasPermission = (
  path: string,
  userRoles: string[],
  userPelayanan: any[]
): boolean => {
  // Admin memiliki akses ke semua
  if (userRoles.includes(ADMIN_ROLE)) return true;

  // Cek apakah path ada di permissionMap
  const permConfig = permissionMap[path];
  if (permConfig) {
    const { roles, requirePIC } = permConfig;

    // Jika memerlukan akses 'semua' (*), berikan akses
    if (roles.includes('*')) return true;

    // Cek apakah pengguna memiliki minimal satu peran yang diperlukan
    const hasRole = roles.some((role) => userRoles.includes(role));

    // Jika tidak butuh PIC, cukup periksa perannya saja
    if (!requirePIC) return hasRole;

    // Jika butuh status PIC, periksa apakah pengguna adalah PIC dalam pelayanan tersebut
    if (hasRole && requirePIC) {
      // Periksa apakah pengguna memiliki is_pic=true untuk salah satu pelayanan yang dibutuhkan
      return userPelayanan.some(
        (p) => roles.includes(p.pelayanan.toLowerCase()) && p.is_pic
      );
    }

    return false;
  }

  // Cek prefix path (untuk handler dynamic paths)
  for (const [permPath, config] of Object.entries(permissionMap)) {
    if (path.startsWith(permPath) && path !== permPath) {
      const { roles, requirePIC } = config;

      if (roles.includes('*')) return true;

      const hasRole = roles.some((role) => userRoles.includes(role));

      if (!requirePIC) return hasRole;

      if (hasRole && requirePIC) {
        return userPelayanan.some(
          (p) => roles.includes(p.pelayanan.toLowerCase()) && p.is_pic
        );
      }

      return false;
    }
  }

  return false;
};

export default function PermissionGuard({ children }: PermissionGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermission = () => {
      const userData = getUserData();

      if (!userData) {
        router.push('/login');
        return;
      }

      // Dapatkan semua pelayanan user
      const userRoles = userData.pelayanan.map((p) =>
        p.pelayanan.toLowerCase()
      );

      // Pelayanan lengkap (untuk cek is_pic)
      const userPelayanan = userData.pelayanan;

      // Periksa apakah user memiliki izin akses
      const authorized = hasPermission(pathname, userRoles, userPelayanan);

      setIsAuthorized(authorized);
      setIsLoading(false);

      if (!authorized) {
        router.push('/404');
      }
    };

    checkPermission();
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
