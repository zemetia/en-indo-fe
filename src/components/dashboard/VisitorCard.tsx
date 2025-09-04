'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BsPersonCheck,
  BsGeoAlt,
} from 'react-icons/bs';
import { FiMoreVertical, FiEdit2, FiTrash2, FiPhone } from 'react-icons/fi';
import { RiInstagramLine } from 'react-icons/ri';

import { type Visitor, getDisplayInfo } from '@/lib/visitor-service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VisitorCardProps {
  visitor: Visitor;
  index: number;
  onDelete: (visitor: Visitor) => void;
}

export default function VisitorCard({ visitor, index, onDelete }: VisitorCardProps) {
  const router = useRouter();
  const displayInfo = getDisplayInfo(visitor);

  return (
    <motion.div
      key={visitor.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col'
    >
      <div 
        className='p-6 cursor-pointer flex-grow'
        onClick={() => router.push(`/dashboard/tamu/${visitor.id}`)}
      >
        <div className='flex items-start justify-between'>
          <div className='flex items-center space-x-4 min-w-0'>
            <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0'>
              <BsPersonCheck className='w-6 h-6 text-green-600'/>
            </div>
            <div className='min-w-0'>
              <h3 className='text-lg font-semibold text-gray-900 truncate'>
                {visitor.name}
              </h3>
              <p className='text-sm text-gray-500 truncate'>{displayInfo.city}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className='p-2 -mr-2 -mt-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors'
                aria-label="Actions"
              >
                <FiMoreVertical className='w-4 h-4' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()} align="end">
              <DropdownMenuItem onSelect={() => router.push(`/dashboard/tamu/${visitor.id}`)}>
                <FiEdit2 className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={() => onDelete(visitor)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <FiTrash2 className="mr-2 h-4 w-4" />
                <span>Hapus</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className='mt-4 pt-4 border-t border-gray-100 space-y-2'>
          <div className='flex items-center text-sm text-gray-600'>
            <FiPhone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className='truncate'>{displayInfo.whatsapp}</span>
          </div>
          <div className='flex items-center text-sm text-gray-600'>
            <RiInstagramLine className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className='truncate'>{displayInfo.instagram}</span>
          </div>
          <div className='flex items-center text-sm text-gray-600'>
            <BsGeoAlt className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className='truncate'>{displayInfo.city}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}