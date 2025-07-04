'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

interface Congregant {
  id: string;
  name: string;
  email: string;
}

export default function CongregantQRPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [congregant, setCongregant] = useState<Congregant | null>(null);

  // Mock data congregant - nantinya akan diambil dari API
  useEffect(() => {
    setCongregant({
      id: params.id,
      name: 'John Doe',
      email: 'john@example.com',
    });
  }, [params.id]);

  const downloadQR = () => {
    // TODO: Implement QR code download
    console.log('Downloading QR code for congregant:', congregant?.id);
  };

  return (
    <div className='space-y-6'>
      {/* Featured Card */}
      <FeaturedCard
        title='QR Code Pribadi'
        description='Tunjukkan QR code ini saat mengikuti event untuk pencatatan kehadiran otomatis'
        actionLabel='Download QR'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <div className='space-y-6'>
            <div className='text-center'>
              <h2 className='text-xl font-semibold text-gray-900'>
                {congregant?.name}
              </h2>
              <p className='text-sm text-gray-500'>{congregant?.email}</p>
            </div>

            <div className='max-w-md mx-auto'>
              <div className='aspect-square bg-white rounded-lg border-2 border-emerald-500 p-4 flex items-center justify-center'>
                <QRCodeSVG
                  value={JSON.stringify({
                    id: congregant?.id,
                    name: congregant?.name,
                    email: congregant?.email,
                  })}
                  size={256}
                  level='H'
                  includeMargin
                  className='text-emerald-500'
                />
              </div>
            </div>

            <div className='text-center space-y-4'>
              <p className='text-sm text-gray-500'>
                QR code ini berisi informasi pribadi Anda dan akan digunakan
                untuk pencatatan kehadiran otomatis. Tunjukkan QR code ini
                kepada panitia event untuk di-scan.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadQR}
                className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
              >
                <Download className='h-4 w-4 mr-2' />
                Download QR Code
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
