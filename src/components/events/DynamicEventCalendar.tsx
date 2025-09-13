'use client';

import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

// Import just the types, not the actual components
type EventCalendarProps = ComponentProps<typeof import('./EventCalendar')['default']>;

// Dynamically import the heavy calendar component
const EventCalendarComponent = dynamic(
  () => import('./EventCalendar'),
  {
    ssr: false, // Don't server-side render the calendar
    loading: () => (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
        
        <div className="h-[600px] bg-white rounded-lg border p-4">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat kalender...</p>
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

// Create a wrapper component that forwards all props
export default function DynamicEventCalendar(props: EventCalendarProps) {
  return <EventCalendarComponent {...props} />;
}