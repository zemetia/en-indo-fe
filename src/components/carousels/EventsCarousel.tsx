'use client';

import Image from 'next/image';
import * as React from 'react';

interface EventItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  date?: string;
  location?: string;
  dataAiHint?: string;
}

interface EventsCarouselProps {
  events: EventItem[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export default function EventsCarousel({
  events,
  autoPlay = true,
  interval = 5000,
  className = '',
}: EventsCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    if (!autoPlay || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, events.length, isHovered]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length
    );
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel */}
      <div
        className='flex transition-transform duration-500 ease-in-out h-[400px] md:h-[500px]'
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {events.map((event, index) => (
          <div
            key={event.id}
            className='min-w-full h-full relative flex items-center justify-center'
          >
            <Image
              src={event.imageSrc}
              alt={event.imageAlt}
              fill
              className='object-cover'
              priority={index === 0}
              data-ai-hint={event.dataAiHint}
            />
            <div className='absolute inset-0 bg-black/40' />
            <div className='absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/80 to-transparent'>
              <div className='container mx-auto'>
                <h3 className='text-2xl md:text-3xl font-bold mb-2'>
                  {event.title}
                </h3>
                <p className='text-lg opacity-90 mb-2'>{event.description}</p>
                {event.date && (
                  <p className='text-sm opacity-75'>
                    <span className='inline-block mr-4'>📅 {event.date}</span>
                    {event.location && <span>📍 {event.location}</span>}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        aria-label='Previous slide'
        className='absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors z-10'
        onClick={prevSlide}
      >
        <svg
          className='w-6 h-6 text-white'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
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
        aria-label='Next slide'
        className='absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors z-10'
        onClick={nextSlide}
      >
        <svg
          className='w-6 h-6 text-white'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 5l7 7-7 7'
          />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10'>
        {events.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
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
