'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/helper';

export default function LoginGuard({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const token = getToken();

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  return children;
}
