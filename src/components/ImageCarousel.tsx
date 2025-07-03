'use client';

import Image from 'next/image';
import * as React from 'react';

const images = [
  {
    src: '/images/carousel/family.jpg',
    alt: 'Keluarga di Every Nation',
  },
  {
    src: '/images/carousel/youth.jpg',
    alt: 'Pemuda Every Nation',
  },
  {
    src: '/images/carousel/community.jpg',
    alt: 'Komunitas Every Nation',
  },
  {
    src: '/images/carousel/worship.jpg',
    alt: 'Ibadah di Every Nation',
  },
  {
    src: '/images/carousel/fellowship.jpg',
    alt: 'Persekutuan Every Nation',
  },
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Ganti gambar setiap 5 detik

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-lg'>
      <div
        className='flex transition-transform duration-500 ease-in-out h-full'
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className='min-w-full h-full relative'>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className='object-cover'
              priority={index === 0}
            />
            <div className='absolute inset-0 bg-black/20' />
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
