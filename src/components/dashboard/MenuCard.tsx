import Link from 'next/link';
import { IconType } from 'react-icons';

interface MenuCardProps {
  title: string;
  description: string;
  icon: IconType;
  href: string;
  color: string;
}

export default function MenuCard({
  title,
  description,
  icon: Icon,
  href,
  color,
}: MenuCardProps) {
  return (
    <Link href={href} className='block group'>
      <div className='bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200'>
        <div className='flex items-center space-x-4'>
          <div
            className={`${color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-200`}
          >
            <Icon className='w-6 h-6' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200'>
              {title}
            </h3>
            <p className='text-sm text-gray-500'>{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
