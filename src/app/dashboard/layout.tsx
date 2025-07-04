'use client';

import * as React from 'react';

import Sidebar from '@/components/navigation/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />
      <main className='flex-1 p-8'>{children}</main>
    </div>
  );
}
