'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import * as React from 'react';

const slides = [
  {
    id: 1,
    image: '/images/auth/slide1.png',
    title: 'Selamat Datang di Every Nation',
    description: 'Membangun generasi yang mengasihi Tuhan dan mengasihi sesama',
  },
  {
    id: 2,
    image: '/images/auth/slide2.jpg',
    title: 'Komunitas yang Bertumbuh',
    description: 'Bersama dalam iman, kasih, dan pengharapan',
  },
  {
    id: 3,
    image: '/images/auth/slide3.jpg',
    title: 'Melayani dengan Kasih',
    description: 'Membawa dampak bagi Indonesia dan dunia',
  },
];

export default function AuthCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='relative h-screen overflow-hidden bg-sage-200'>
      {/* Background Carousel */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className='absolute inset-0'
        >
          <Image
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            fill
            className='object-cover'
            priority={currentIndex === 0}
          />
          <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60' />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className='relative z-10 h-full flex flex-col items-center justify-center p-12 text-white'>
        <motion.div
          key={`content-${currentIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='text-center'
        >
          <h2 className='text-4xl md:text-5xl font-bold mb-6 leading-tight'>
            {slides[currentIndex].title}
          </h2>
          <p className='text-xl text-white/90 max-w-2xl mx-auto leading-relaxed'>
            {slides[currentIndex].description}
          </p>
        </motion.div>

        {/* Dots Navigation */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3'>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
