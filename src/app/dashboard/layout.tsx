'use client';

import * as React from 'react';

import Sidebar from '@/components/navigation/Sidebar';
import PermissionGuard from '@/components/auth/PermissionGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard>
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <main className='flex-1 p-8'>{children}</main>
      </div>
    </PermissionGuard>
  );
}
