import { Metadata } from 'next';

import LoginForm from '@/components/auth/LoginForm';
import LoginGuard from '@/app/login/loginGuard';

export const metadata: Metadata = {
  title: 'Login - Every Nation Indonesia',
  description: 'Masuk ke akun Every Nation Indonesia Anda',
};

export default function LoginPage() {
  return (
    <LoginGuard>
      <LoginForm />
    </LoginGuard>
  );
}
