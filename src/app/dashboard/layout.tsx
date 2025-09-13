'use client';

import * as React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Sidebar from '@/components/navigation/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className='flex h-screen bg-gray-50 overflow-hidden'>
        <Sidebar />
        <main className='flex-1 p-8 overflow-y-auto'>{children}</main>
      </div>
    </AuthProvider>
  );
}
