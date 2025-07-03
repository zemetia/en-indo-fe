import { IconType } from 'react-icons';

import MenuCard from './MenuCard';

interface MenuItem {
  title: string;
  description: string;
  icon: IconType;
  href: string;
  color: string;
}

interface MenuGridProps {
  items: MenuItem[];
}

export default function MenuGrid({ items }: MenuGridProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {items.map((item) => (
        <MenuCard key={item.title} {...item} />
      ))}
    </div>
  );
}
