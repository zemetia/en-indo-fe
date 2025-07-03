'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as React from 'react';

import { useToast } from '@/context/ToastContext';

import AuthCarousel from './AuthCarousel';
import { setUserData, UserData } from '@/lib/helper';

// Define interfaces for your form data and API response
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

    axios
      .post<LoginResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/login`,
        formData
      )
      .then(function (response) {
        console.log(response);
        setIsLoading(false);

        showToast('Login berhasil! Mengalihkan ke dashboard...', 'success');
        setUserData(response.data.data);
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      })
      .catch(function (error) {
        setIsLoading(false);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            showToast('Email atau kata sandi salah', 'error');
          } else {
            showToast('Terjadi kesalahan server. Silakan coba lagi.', 'error');
          }

          console.error('Login error:', error.response?.data);
        } else {
          showToast('Terjadi kesalahan tak terduga', 'error');
          console.error('Unexpected error:', error);
        }
      });
  };

  return (
    <div className='max-h-screen flex items-center justify-center bg-gray-50 py-8 md:py-12 px-4'>
      <div className='flex w-full max-w-6xl overflow-hidden rounded-2xl shadow-2xl'>
        {/* Left Side - Carousel */}
        <div className='relative hidden md:block md:w-3/5'>
          <AuthCarousel />
        </div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full md:w-2/5 bg-white p-6 sm:p-8 md:p-10'
        >
          <div className='max-w-sm mx-auto'>
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='mb-6'
            >
              <Link
                href='/'
                className='inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 mr-2'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='font-medium'>Kembali</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='text-center mb-8'
            >
              <Image
                src='/images/logo.png'
                alt='Every Nation Logo'
                width={120}
                height={32}
                className='h-8 w-auto mx-auto'
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='text-xl font-semibold text-gray-900 text-center mb-6'
            >
              Selamat Datang Kembali
            </motion.h1>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onSubmit={handleSubmit}
              className='space-y-5'
            >
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-1.5'
                >
                  Email
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base'
                  placeholder='Masukkan email Anda'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 mb-1.5'
                >
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  value={formData.password}
                  onChange={handleChange}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base'
                  placeholder='Masukkan password Anda'
                  required
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    type='checkbox'
                    className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='remember-me'
                    className='ml-2 block text-sm text-gray-700'
                  >
                    Ingat saya
                  </label>
                </div>
                <Link
                  href='/forgot-password'
                  className='text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors'
                >
                  Lupa password?
                </Link>
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className={`w-full bg-primary-600 text-white py-2.5 px-4 rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg text-base font-medium ${
                  isLoading ? 'cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className='flex items-center justify-center'>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Masuk'
                )}
              </button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className='mt-5 text-center text-sm text-gray-600'
              >
                Belum punya akun?{' '}
                <Link
                  href='/register'
                  className='font-medium text-primary-600 hover:text-primary-500 transition-colors'
                >
                  Daftar sekarang
                </Link>
              </motion.p>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
