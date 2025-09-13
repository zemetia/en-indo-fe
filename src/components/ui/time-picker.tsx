'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TimePickerProps {
  value?: string; // Format: "HH:mm"
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({
  value = '',
  onChange,
  label,
  placeholder = 'Select time',
  disabled = false,
  className = ''
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');

  // Parse value when it changes
  useEffect(() => {
    if (value && value.includes(':')) {
      const [h, m] = value.split(':');
      setHours(h.padStart(2, '0'));
      setMinutes(m.padStart(2, '0'));
    }
  }, [value]);

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const timeValue = `${newHours.padStart(2, '0')}:${newMinutes.padStart(2, '0')}`;
    onChange(timeValue);
  };

  const handleHourChange = (newHours: string) => {
    const h = Math.max(0, Math.min(23, parseInt(newHours) || 0)).toString();
    setHours(h.padStart(2, '0'));
    handleTimeChange(h, minutes);
  };

  const handleMinuteChange = (newMinutes: string) => {
    const m = Math.max(0, Math.min(59, parseInt(newMinutes) || 0)).toString();
    setMinutes(m.padStart(2, '0'));
    handleTimeChange(hours, m);
  };

  const formatDisplayTime = () => {
    if (!value) return placeholder;
    return value;
  };

  return (
    <div className={className}>
      {label && <Label className="text-sm font-medium mb-2 block">{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className="w-full justify-start text-left font-normal"
          >
            <Clock className="mr-2 h-4 w-4" />
            {formatDisplayTime()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-4">
            <div className="text-sm font-medium">Select Time</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="hours" className="text-xs">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  max="23"
                  value={parseInt(hours)}
                  onChange={(e) => handleHourChange(e.target.value)}
                  className="text-center"
                />
              </div>
              <div>
                <Label htmlFor="minutes" className="text-xs">Minutes</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  step="5"
                  value={parseInt(minutes)}
                  onChange={(e) => handleMinuteChange(e.target.value)}
                  className="text-center"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[0, 15, 30, 45].map((minute) => (
                <Button
                  key={minute}
                  size="sm"
                  variant="outline"
                  onClick={() => handleMinuteChange(minute.toString())}
                  className="text-xs"
                >
                  :{minute.toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => setIsOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface TimeRangePickerProps {
  startTime?: string;
  endTime?: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  startLabel?: string;
  endLabel?: string;
  disabled?: boolean;
  className?: string;
  validateRange?: boolean;
}

export function TimeRangePicker({
  startTime = '',
  endTime = '',
  onStartTimeChange,
  onEndTimeChange,
  startLabel = 'Start Time',
  endLabel = 'End Time',
  disabled = false,
  className = '',
  validateRange = true
}: TimeRangePickerProps) {
  const [error, setError] = useState<string>('');

  const validateTimeRange = (start: string, end: string) => {
    if (!validateRange || !start || !end) {
      setError('');
      return true;
    }

    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) {
      setError('End time must be after start time');
      return false;
    }

    setError('');
    return true;
  };

  const handleStartTimeChange = (value: string) => {
    onStartTimeChange(value);
    validateTimeRange(value, endTime);
  };

  const handleEndTimeChange = (value: string) => {
    onEndTimeChange(value);
    validateTimeRange(startTime, value);
  };

  const calculateDuration = () => {
    if (!startTime || !endTime) return null;

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (endMinutes <= startMinutes) return null;

    const durationMinutes = endMinutes - startMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TimePicker
          label={startLabel}
          value={startTime}
          onChange={handleStartTimeChange}
          disabled={disabled}
          placeholder="Select start time"
        />
        <TimePicker
          label={endLabel}
          value={endTime}
          onChange={handleEndTimeChange}
          disabled={disabled}
          placeholder="Select end time"
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
      
      {!error && calculateDuration() && (
        <p className="text-sm text-gray-500 mt-2">
          Duration: {calculateDuration()}
        </p>
      )}
    </div>
  );
}

// Duration Calculator Hook
export function useDurationCalculator() {
  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return null;

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    // Handle overnight events
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60; // Add 24 hours
    }

    const durationMinutes = endMinutes - startMinutes;
    
    return {
      totalMinutes: durationMinutes,
      hours: Math.floor(durationMinutes / 60),
      minutes: durationMinutes % 60,
      formatted: formatDuration(durationMinutes)
    };
  };

  const formatDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const addDuration = (startTime: string, durationMinutes: number) => {
    if (!startTime) return '';

    const [startHour, startMin] = startTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMin;
    const endTotalMinutes = startTotalMinutes + durationMinutes;
    
    const endHour = Math.floor(endTotalMinutes / 60) % 24;
    const endMin = endTotalMinutes % 60;

    return `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
  };

  return {
    calculateDuration,
    formatDuration,
    addDuration
  };
}