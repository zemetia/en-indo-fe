'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/helper';

export default function LoginGuard({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check for token on the client side only
    const token = getToken();
    if (token) {
      router.push('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    // Render a loading state while checking for the token
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600'></div>
      </div>
    );
  }

  return <>{children}</>;
}
