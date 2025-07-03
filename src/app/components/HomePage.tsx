'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

export default function HomePage() {
  // State untuk mengontrol carousel pada tampilan mobile
  const [currentIndex, setCurrentIndex] = React.useState(0);
  // State untuk foto yang dihover pada desktop
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

  // Data foto komunitas dengan deskripsi
  const communityPhotos = [
    {
      src: '/images/grid/family.jpg',
      alt: 'Keluarga',
      description: 'Membangun keluarga yang kuat dalam kasih Kristus',
    },
    {
      src: '/images/grid/youth.jpg',
      alt: 'Pemuda',
      description: 'Generasi muda yang berapi-api untuk Tuhan',
    },
    {
      src: '/images/grid/worship.jpg',
      alt: 'Ibadah',
      description: 'Menyembah Tuhan dengan segenap hati dan jiwa',
    },
    {
      src: '/images/grid/community.jpg',
      alt: 'Komunitas',
      description: 'Bertumbuh bersama dalam kebersamaan',
    },
    {
      src: '/images/grid/fellowship.jpg',
      alt: 'Persekutuan',
      description: 'Saling menguatkan dalam iman',
    },
  ];

  // Fungsi navigasi carousel
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % communityPhotos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? communityPhotos.length - 1 : prev - 1
    );
  };

  return (
    <main className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden'>
        {/* Background Image with Parallax Effect */}
        <div className='absolute inset-0 z-0'>
          <Image
            src='/images/background.jpg'
            alt='Background'
            fill
            className='object-cover scale-110'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70'></div>
        </div>

        {/* Content */}
        <div className='container mx-auto px-4 text-center relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight'>
              Every Nation Indonesia
            </h1>
            <p className='text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed'>
              Membangun generasi yang mengasihi Tuhan dan mengasihi sesama
            </p>
            <Link
              href='/about'
              className='inline-block bg-primary-600 text-white px-8 py-4 rounded-full hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
              Pelajari Lebih Lanjut
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className='py-20 bg-gray-50 relative overflow-hidden'>
        <div className='absolute inset-0 bg-grid-pattern opacity-5'></div>
        <div className='container mx-auto px-4 relative'>
          <div className='max-w-4xl mx-auto text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className='relative'
            >
              <svg
                className='absolute -top-4 -left-4 w-8 h-8 text-primary-500 opacity-20'
                fill='currentColor'
                viewBox='0 0 32 32'
              >
                <path d='M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z' />
              </svg>
              <blockquote className='text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 mb-8 m-4 leading-relaxed text-justify'>
                Kami ada untuk menghormati Allah dengan mendirikan gereja-gereja
                dan pelayanan kampus yang berpusat pada Kristus, diberdayakan
                oleh Roh, dan bertanggung jawab secara sosial di setiap bangsa.
              </blockquote>
              <p className='text-base sm:text-lg text-gray-600 leading-relaxed'>
                Every Nation Indonesia berkomitmen untuk membangun generasi yang
                mengasihi Tuhan dan mengasihi sesama, melalui pelayanan yang
                transformatif dan relevan dengan kebutuhan zaman.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Photos Section - Modified with Modern Layout */}
      <section className='py-20 bg-white relative overflow-hidden'>
        <div className='container mx-auto px-4'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='text-2xl sm:text-3xl font-bold text-center mb-12'
          >
            Komunitas Kami
          </motion.h2>

          {/* Desktop View - Modern Interactive Gallery */}
          <div className='hidden md:block'>
            <div className='grid grid-cols-3 gap-8 max-w-5xl mx-auto'>
              {communityPhotos.map((photo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: [0.25, 0.1, 0.25, 1.0],
                  }}
                  viewport={{ once: true, margin: '-100px' }}
                  className='relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl'
                  style={{
                    transformOrigin:
                      index % 2 === 0 ? 'left center' : 'right center',
                  }}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className='object-cover transition-transform duration-700'
                    style={{
                      transform:
                        hoverIndex === index ? 'scale(1.1)' : 'scale(1.01)',
                    }}
                  />

                  {/* Overlay Gradient */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80' />

                  {/* Content Container */}
                  <div className='absolute inset-0 flex flex-col justify-end p-6 text-white'>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: hoverIndex === index ? 1 : 0.9,
                        y: hoverIndex === index ? 0 : 10,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className='text-2xl font-bold mb-2'>{photo.alt}</h3>
                      <p
                        className={`text-sm text-white/90 overflow-hidden transition-all duration-500 ${
                          hoverIndex === index
                            ? 'max-h-20 opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        {photo.description}
                      </p>
                    </motion.div>

                    {/* Action Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: hoverIndex === index ? 1 : 0,
                        y: hoverIndex === index ? 0 : 10,
                      }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className='mt-4'
                    >
                      <Link
                        href={`/community/${photo.alt.toLowerCase()}`}
                        className='inline-flex items-center text-sm text-white/90 hover:text-white transition-colors'
                      >
                        <span>Selengkapnya</span>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-4 w-4 ml-1'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M14 5l7 7m0 0l-7 7m7-7H3'
                          />
                        </svg>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile View - Modern Carousel */}
          <div className='md:hidden relative'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className='aspect-[3/4] relative rounded-xl overflow-hidden shadow-lg mx-auto max-w-xs'
              >
                <Image
                  src={communityPhotos[currentIndex].src}
                  alt={communityPhotos[currentIndex].alt}
                  fill
                  className='object-cover'
                />
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-4 px-3'>
                  <p className='text-white text-center font-medium'>
                    {communityPhotos[currentIndex].alt}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10'
              aria-label='Previous photo'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-gray-800'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10'
              aria-label='Next photo'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-gray-800'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className='flex justify-center mt-4 space-x-2'>
              {communityPhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    index === currentIndex
                      ? 'bg-primary-600 scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to photo ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campus Ministry Section - Updated */}
      <section className='py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='max-w-6xl mx-auto'
          >
            <div className='flex flex-col md:flex-row items-center bg-white rounded-2xl overflow-hidden shadow-xl'>
              {/* Left Side - Image */}
              <div className='md:w-1/2 relative h-96 md:h-auto'>
                <Image
                  src='/images/campus-ministry.jpg'
                  alt='Every Nation Campus'
                  fill
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-r from-primary-900/40 to-transparent'></div>

                {/* Big Logo Overlay */}
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40'>
                  <div className='relative w-full h-full'>
                    <Image
                      src='/images/enc-logo.png'
                      alt='ENC'
                      fill
                      className='object-contain drop-shadow-lg'
                    />
                  </div>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className='md:w-1/2 p-8 md:p-10 text-right'>
                <div className='mb-6'>
                  <motion.h2
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className='text-4xl font-bold mb-4'
                  >
                    EVERY NATION CAMPUS
                  </motion.h2>
                  <div className='w-20 h-1 bg-primary-600 mb-6 ml-auto'></div>
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className='text-gray-700 leading-relaxed mb-6'
                  >
                    Misionaris kampus berbasis gereja di seluruh dunia
                    menginjili dan mendidik mahasiswa, memajukan kerajaan Tuhan
                    di kampus universitas.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href='/campus'
                      className='inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-md'
                    >
                      MENGAPA KAMPUS?
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-gray-50 relative overflow-hidden'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='grid grid-cols-1 md:grid-cols-3 gap-8'
          >
            {[
              {
                icon: (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                  />
                ),
                title: 'Pembelajaran Alkitab',
                description: 'Menggali kebenaran firman Tuhan secara mendalam',
              },
              {
                icon: (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                ),
                title: 'Komunitas',
                description: 'Bertumbuh bersama dalam persekutuan',
              },
              {
                icon: (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
                  />
                ),
                title: 'Misi Global',
                description: 'Membawa dampak ke seluruh dunia',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className='text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300'
              >
                <div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <svg
                    className='w-8 h-8 text-primary-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className='text-xl font-semibold mb-4'>{feature.title}</h3>
                <p className='text-gray-600 leading-relaxed'>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-primary-50 relative overflow-hidden'>
        <div className='absolute inset-0 bg-grid-pattern opacity-5'></div>
        <div className='container mx-auto px-4 text-center relative'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='text-2xl sm:text-3xl font-bold mb-6'>
              Bergabunglah Bersama Kami
            </h2>
            <p className='text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed'>
              Jadilah bagian dari gerakan yang membawa perubahan dalam hidup
              orang-orang
            </p>
            <Link
              href='/contact'
              className='inline-block bg-primary-600 text-white px-8 py-4 rounded-full hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
              Hubungi Kami
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
