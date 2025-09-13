import * as React from 'react';

type FeaturedCardProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
  gradientFrom?: string;
  gradientTo?: string;
};

export default function FeaturedCard({
  title,
  description,
  actionLabel,
  onAction,
  gradientFrom = 'from-primary-500',
  gradientTo = 'to-primary-600',
}: FeaturedCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white p-6 md:p-8`}
    >
      <div className='relative z-10 max-w-xl'>
        <h2 className='text-xl md:text-2xl font-bold mb-2'>{title}</h2>
        <p className='text-white/90 mb-4 text-sm md:text-base'>{description}</p>
        <button
          onClick={onAction}
          className='inline-flex items-center px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm'
        >
          {actionLabel}
          <svg
            className='w-4 h-4 ml-2'
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
      </div>
      <div className='absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4'>
        <svg className='w-64 h-64' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z' />
        </svg>
      </div>
    </div>
  );
}
