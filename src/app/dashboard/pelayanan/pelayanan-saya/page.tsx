'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { FiAward, FiHome, FiStar, FiUser, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { MdOutlineVolunteerActivism } from 'react-icons/md';
import Image from 'next/image';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { pelayananService } from '@/lib/pelayanan-service';
import { Pelayanan } from '@/lib/helper';
import Skeleton from '@/components/Skeleton';

export default function PelayananSayaPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [pelayananData, setPelayananData] = useState<Pelayanan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPelayananData = async () => {
      // Don't fetch if auth is still loading
      if (authLoading) return;

      try {
        setIsLoading(true);
        setError(null);
        
        // If user is authenticated, try to get data from API
        if (user) {
          try {
            const apiData = await pelayananService.getMyPelayanan();
            setPelayananData(apiData);
          } catch (apiError) {
            console.warn('Failed to fetch from API, using cached data:', apiError);
            
            // Fallback to user data from context (from login)
            if (user.pelayanan && user.pelayanan.length > 0) {
              setPelayananData(user.pelayanan);
              showToast('Data dimuat dari cache karena tidak dapat terhubung ke server', 'warning');
            } else {
              // Don't set error, just show empty state with explanation
              setPelayananData([]);
              showToast('Tidak dapat memuat data pelayanan saat ini', 'warning');
            }
          }
        } else {
          // If user is not authenticated, show empty state without error
          setPelayananData([]);
        }
      } catch (unexpectedError) {
        console.error('Unexpected error in fetchPelayananData:', unexpectedError);
        setPelayananData([]);
        showToast('Terjadi kesalahan tidak terduga', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    // Only run once when auth loading is done
    if (!authLoading) {
      fetchPelayananData();
    }
  }, [authLoading, user?.token]);

  if (authLoading || isLoading) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='Pelayanan Saya'
          description='Lihat pelayanan dan tanggung jawab Anda'
          actionLabel=''
          gradientFrom='from-yellow-500'
          gradientTo='to-orange-500'
        />
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
          <div className='space-y-4'>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }


  const totalPelayanan = pelayananData.length;
  const totalPIC = pelayananData.filter(p => p.is_pic).length;
  const totalGereja = new Set(pelayananData.map(p => p.church_id)).size;

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Pelayanan Saya'
        description={user ? `Anda memiliki ${totalPelayanan} penugasan pelayanan aktif` : 'Lihat daftar pelayanan dan tanggung jawab di Every Nation'}
        actionLabel={user ? 'Lihat Jadwal Saya' : 'Login untuk Lihat Detail'}
        onAction={() => window.location.href = user ? '/dashboard/jadwal-saya' : '/login'}
        gradientFrom='from-yellow-500'
        gradientTo='to-orange-500'
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <MdOutlineVolunteerActivism className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Pelayanan</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPelayanan}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-100 rounded-full">
                  <FiStar className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Posisi PIC</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPIC}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FiHome className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gereja</p>
                  <p className="text-2xl font-bold text-gray-900">{totalGereja}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pelayanan List */}
      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>Detail Pelayanan</h2>
            <p className='text-sm text-gray-500 mt-1'>Daftar lengkap pelayanan dan tanggung jawab Anda</p>
          </div>
          {user && (
            <div className='flex items-center space-x-3'>
              <Image 
                src={user.image_url || '/images/avatar.jpg'} 
                alt={user.nama} 
                width={40} 
                height={40} 
                className="rounded-full" 
                data-ai-hint="user profile image"
              />
              <div>
                <p className="font-medium text-gray-900">{user.nama}</p>
                <p className="text-sm text-gray-500">Pelayan</p>
              </div>
            </div>
          )}
        </div>

        {pelayananData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {pelayananData.map((pelayanan, index) => (
              <motion.div 
                key={`${pelayanan.pelayanan_id}-${pelayanan.church_id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <FiAward className="text-yellow-600 w-5 h-5"/>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{pelayanan.pelayanan}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <FiHome className="text-gray-400 w-4 h-4"/>
                            {pelayanan.church_name}
                          </CardDescription>
                        </div>
                      </div>
                      {pelayanan.is_pic && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <FiStar className='w-3 h-3 mr-1'/>
                          PIC
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiCheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Status: Aktif
                      </div>
                      
                      {pelayanan.is_pic && (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-sm font-medium text-amber-800 mb-1">Tanggung Jawab PIC:</p>
                          <ul className="text-xs text-amber-700 space-y-1">
                            <li>• Koordinasi tim pelayanan</li>
                            <li>• Pengawasan jadwal pelayanan</li>
                            <li>• Pembinaan anggota tim</li>
                          </ul>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        <button 
                          onClick={() => window.location.href = '/dashboard/jadwal-saya'}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <FiCalendar className="w-4 h-4 mr-2" />
                          Jadwal
                        </button>
                        <button 
                          onClick={() => window.location.href = '/dashboard/ketersediaan'}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 transition-colors"
                        >
                          <FiCheckCircle className="w-4 h-4 mr-2" />
                          Konfirmasi
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className='text-center py-16 text-gray-500 bg-gray-50 rounded-lg'>
            <FiUser className='mx-auto h-12 w-12 text-gray-400 mb-4' />
            <h3 className="text-lg font-semibold text-gray-800">
              {user ? 'Tidak Ada Penugasan Pelayanan' : 'Selamat Datang di Pelayanan Saya'}
            </h3>
            <p>
              {user 
                ? 'Anda belum memiliki penugasan pelayanan. Hubungi admin untuk mendapatkan penugasan.' 
                : 'Silakan login untuk melihat penugasan pelayanan Anda.'
              }
            </p>
            {!user && (
              <button
                onClick={() => window.location.href = '/login'}
                className="mt-4 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Login Sekarang
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}