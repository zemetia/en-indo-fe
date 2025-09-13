'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Users,
} from 'lucide-react';
import { FiMail, FiPhone } from 'react-icons/fi';

interface Person {
  id: string;
  nama: string;
  church: string;
  email: string | null;
  nomor_telepon: string | null;
  is_aktif: boolean;
}

interface PersonCardProps {
    person: Person;
    index: number;
}

export default function PersonCard({ person, index }: PersonCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col'
    >
      <div 
        className='p-5 cursor-pointer flex-grow'
        onClick={() => router.push(`/dashboard/jemaat/${person.id}`)}
      >
        <div className='flex items-start justify-between'>
          <div className='flex items-center space-x-4 min-w-0'>
              <div className={`w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 ring-4 ${person.is_aktif ? 'ring-green-300' : 'ring-red-300'}`}>
                  <Users className='w-6 h-6 text-blue-600'/>
              </div>
              <div className='min-w-0'>
                  <h3 className='text-md font-semibold text-gray-900 truncate'>
                      {person.nama}
                  </h3>
                  <p className='text-sm text-gray-500 truncate'>{person.church}</p>
              </div>
          </div>
        </div>
        
        <div className='mt-4 pt-4 border-t border-gray-100 space-y-2'>
          <div className='flex items-center text-sm text-gray-600'>
              <FiMail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className='truncate'>{person.email || '-'}</span>
          </div>
          <div className='flex items-center text-sm text-gray-600'>
              <FiPhone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className='truncate'>{person.nomor_telepon || '-'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
