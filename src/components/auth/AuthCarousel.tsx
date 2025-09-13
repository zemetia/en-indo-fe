'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import * as React from 'react';

const slides = [
  {
    id: 1,
    image: 'https://placehold.co/800x1200.png',
    dataAiHint: 'church community',
    title: 'Selamat Datang di Portal EN',
    description: 'Membangun generasi yang mengasihi Tuhan dan mengasihi sesama.',
  },
  {
    id: 2,
    image: 'https://placehold.co/800x1200.png',
    dataAiHint: 'worship concert',
    title: 'Komunitas yang Bertumbuh',
    description: 'Bersama dalam iman, kasih, dan pengharapan.',
  },
  {
    id: 3,
    image: 'https://placehold.co/800x1200.png',
    dataAiHint: 'people serving',
    title: 'Melayani dengan Hati',
    description: 'Membawa dampak positif bagi Indonesia dan dunia.',
  },
];

export default function AuthCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='relative h-full w-full overflow-hidden bg-blue-900'>
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className='absolute inset-0'
        >
          <Image
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            data-ai-hint={slides[currentIndex].dataAiHint}
            fill
            className='object-cover'
            priority={currentIndex === 0}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-blue-900/30 to-transparent' />
        </motion.div>
      </AnimatePresence>

      <div className='relative z-10 h-full flex flex-col justify-end p-12 text-white'>
        <motion.div
          key={`content-${currentIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className='max-w-md'
        >
          <h2 className='text-4xl font-bold mb-4 leading-tight'>
            {slides[currentIndex].title}
          </h2>
          <p className='text-lg text-blue-100'>
            {slides[currentIndex].description}
          </p>
        </motion.div>
      </div>
      
      <div className='absolute bottom-8 left-12 flex space-x-2'>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-110' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
