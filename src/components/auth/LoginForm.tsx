'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as React from 'react';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/context/ToastContext';
import AuthCarousel from './AuthCarousel';
import { setUserData, UserData } from '@/lib/helper';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: UserData;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/login`,
        formData
      );

      setIsLoading(false);
      showToast('Login berhasil! Mengalihkan ke dashboard...', 'success');
      setUserData(response.data.data);
      
      // Redirect after a short delay to allow toast to be seen
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh(); // Refresh to ensure server components get the new cookie
      }, 500);

    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 401) {
            showToast('Email atau kata sandi salah.', 'error');
          } else {
            showToast(error.response.data?.message || 'Terjadi kesalahan server.', 'error');
          }
          console.error('Login error:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          showToast('Tidak dapat terhubung ke server. Periksa koneksi Anda.', 'error');
          console.error('Network error:', error.message);
        } else {
          // Something happened in setting up the request that triggered an Error
          showToast('Terjadi kesalahan saat menyiapkan permintaan.', 'error');
          console.error('Request setup error:', error.message);
        }
      } else {
        showToast('Terjadi kesalahan yang tidak terduga.', 'error');
        console.error('Unexpected error:', error);
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className='w-full min-h-screen bg-white grid lg:grid-cols-5'>
      {/* Left Side - Carousel */}
      <div className='hidden lg:block lg:col-span-3 relative'>
        <AuthCarousel />
      </div>

      {/* Right Side - Login Form */}
      <div className='col-span-full lg:col-span-2 flex flex-col items-center justify-center p-6 md:p-10'>
        <motion.div 
            className='w-full max-w-sm'
            initial="hidden"
            animate="visible"
            variants={formVariants}
        >
          <motion.div variants={itemVariants}>
            <Link href='/' className='inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 mb-8 group'>
                <FiArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Kembali ke Beranda
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants} className='text-center mb-8'>
            <Image
              src='/images/logo.png'
              alt='Every Nation Logo'
              width={140}
              height={37}
              className='h-9 w-auto mx-auto mb-4'
            />
            <h1 className='text-2xl font-bold text-blue-900'>
              Portal Every Nation
            </h1>
            <p className="text-gray-500 mt-1">Masuk untuk mengakses dasbor Anda.</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className='space-y-5'
          >
            <motion.div variants={itemVariants}>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-1.5'
              >
                Email
              </label>
              <Input
                id='email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='anda@email.com'
                required
                className="bg-sky-50"
                disabled={isLoading}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-1.5'
              >
                Password
              </label>
              <Input
                id='password'
                name='password'
                type='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='••••••••'
                required
                className="bg-sky-50"
                disabled={isLoading}
              />
            </motion.div>

            <motion.div variants={itemVariants} className='flex items-center justify-between text-sm'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  disabled={isLoading}
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-gray-700'
                >
                  Ingat saya
                </label>
              </div>
              <Link
                href='/forgot-password'
                className='font-medium text-blue-600 hover:text-blue-500 transition-colors'
              >
                Lupa password?
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type='submit'
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-base"
                size="lg"
              >
                {isLoading ? (
                  <span className='flex items-center justify-center'>
                    <FiLoader className='animate-spin mr-2 h-4 w-4' />
                    Memproses...
                  </span>
                ) : (
                  'Masuk'
                )}
              </Button>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className='text-center text-sm text-gray-500 !mt-8'
            >
              Belum punya akun?{' '}
              <Link
                href='/register'
                className='font-medium text-blue-600 hover:underline'
              >
                Daftar di sini
              </Link>
            </motion.p>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
