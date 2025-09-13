'use client';
import { Pelayanan } from '@/lib/helper';

import { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import * as React from 'react';

type UserProfileProps = {
  isCollapsed: boolean;
  name: string;
  pelayanan: Pelayanan[];
  imageUrl: string;
};

export default function UserProfile({
  isCollapsed,
  name,
  pelayanan,
  imageUrl,
}: UserProfileProps) {
  const [currentPelayananIndex, setCurrentPelayananIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pelayanan.length <= 1) return;

    const interval = setInterval(() => {
      if (!showDropdown) {
        setCurrentPelayananIndex((prev) =>
          prev === pelayanan.length - 1 ? 0 : prev + 1
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pelayanan.length, showDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (pelayanan.length > 1) {
        setShowDropdown(!showDropdown);
    }
  };

  return (
    <div
      className={`flex items-center p-4 border-b border-gray-200 ${
        isCollapsed ? 'justify-center' : 'space-x-3'
      }`}
    >
      <Image
        src={imageUrl}
        alt={name}
        width={40}
        height={40}
        className='rounded-full border-2 border-gray-200'
      />
      {!isCollapsed && (
        <div className='min-w-0 flex-1 relative'>
          <p className='text-sm font-medium text-gray-900 truncate'>{name}</p>
          {pelayanan.length > 0 && (
            <div ref={dropdownRef} className='mt-1'>
              <div
                onClick={toggleDropdown}
                className={`flex items-center space-x-1 ${pelayanan.length > 1 ? 'cursor-pointer' : ''}`}
              >
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={currentPelayananIndex}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.3 }}
                    className='flex items-center'
                  >
                    <span className='text-xs font-medium text-primary-600'>
                      {pelayanan[currentPelayananIndex]?.pelayanan || 'Jemaat'}
                      {pelayanan[currentPelayananIndex]?.is_pic && (
                        <span className='ml-1 text-xs text-amber-600'>
                          (PIC)
                        </span>
                      )}
                    </span>
                  </motion.div>
                </AnimatePresence>
                {pelayanan.length > 1 && (showDropdown ? (
                  <FiChevronUp className='w-3 h-3 text-gray-500' />
                ) : (
                  <FiChevronDown className='w-3 h-3 text-gray-500' />
                ))}
              </div>

              <AnimatePresence>
                {showDropdown && pelayanan.length > 1 &&(
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='absolute z-40 mt-1 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200'
                  >
                    {pelayanan.map((item: Pelayanan, index: number) => (
                      <div
                        key={item.pelayanan_id}
                        onClick={() => {
                            setCurrentPelayananIndex(index);
                            setShowDropdown(false);
                        }}
                        className='px-3 py-2 text-xs hover:bg-gray-50 cursor-pointer flex justify-between items-center'
                      >
                        <span className='font-medium text-gray-800'>
                          {item.pelayanan}
                        </span>
                        {item.is_pic && (
                          <span className='text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full'>
                            PIC
                          </span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
