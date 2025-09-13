'use client';

import React, { useState, useEffect } from 'react';
import { Repeat, Calendar, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number;
  byWeekday?: string[];
  byMonthDay?: number[];
  byMonth?: number[];
  bySetPos?: number[];
  weekStart?: string;
  byYearDay?: number[];
  count?: number;
  until?: string;
}

interface RecurrencePickerProps {
  value?: RecurrenceRule | null;
  onChange: (rule: RecurrenceRule | null) => void;
  startDate?: string; // YYYY-MM-DD format
  className?: string;
  disabled?: boolean;
}

const WEEKDAYS = [
  { value: 'SU', label: 'Sunday', short: 'S' },
  { value: 'MO', label: 'Monday', short: 'M' },
  { value: 'TU', label: 'Tuesday', short: 'T' },
  { value: 'WE', label: 'Wednesday', short: 'W' },
  { value: 'TH', label: 'Thursday', short: 'T' },
  { value: 'FR', label: 'Friday', short: 'F' },
  { value: 'SA', label: 'Saturday', short: 'S' }
];

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

const ORDINALS = [
  { value: 1, label: '1st' },
  { value: 2, label: '2nd' },
  { value: 3, label: '3rd' },
  { value: 4, label: '4th' },
  { value: -1, label: 'Last' }
];

export function RecurrencePicker({
  value,
  onChange,
  startDate,
  className = '',
  disabled = false
}: RecurrencePickerProps) {
  const [isRecurring, setIsRecurring] = useState(!!value);
  const [rule, setRule] = useState<RecurrenceRule>({
    frequency: 'WEEKLY',
    interval: 1,
    byWeekday: ['MO'],
    weekStart: 'MO'
  });

  useEffect(() => {
    if (value) {
      setRule(value);
      setIsRecurring(true);
    } else {
      setIsRecurring(false);
    }
  }, [value]);

  const handleRecurrenceToggle = (enabled: boolean) => {
    setIsRecurring(enabled);
    if (enabled) {
      const defaultRule = getDefaultRuleForDate(startDate);
      setRule(defaultRule);
      onChange(defaultRule);
    } else {
      onChange(null);
    }
  };

  const getDefaultRuleForDate = (dateString?: string): RecurrenceRule => {
    if (dateString) {
      const date = new Date(dateString);
      const weekday = WEEKDAYS[date.getDay()].value;
      return {
        frequency: 'WEEKLY',
        interval: 1,
        byWeekday: [weekday],
        weekStart: 'MO'
      };
    }
    return {
      frequency: 'WEEKLY',
      interval: 1,
      byWeekday: ['MO'],
      weekStart: 'MO'
    };
  };

  const updateRule = (updates: Partial<RecurrenceRule>) => {
    const newRule = { ...rule, ...updates };
    setRule(newRule);
    onChange(newRule);
  };

  const getRecurrenceDescription = () => {
    if (!isRecurring || !rule) return 'Does not repeat';

    const { frequency, interval, byWeekday, byMonthDay, bySetPos } = rule;

    switch (frequency) {
      case 'DAILY':
        return interval === 1 ? 'Daily' : `Every ${interval} days`;

      case 'WEEKLY':
        if (byWeekday && byWeekday.length > 0) {
          const days = byWeekday.map(d => WEEKDAYS.find(w => w.value === d)?.label).join(', ');
          const prefix = interval === 1 ? 'Weekly on' : `Every ${interval} weeks on`;
          return `${prefix} ${days}`;
        }
        return interval === 1 ? 'Weekly' : `Every ${interval} weeks`;

      case 'MONTHLY':
        if (byMonthDay && byMonthDay.length > 0) {
          const dayText = byMonthDay.map(d => d === -1 ? 'last day' : `day ${d}`).join(', ');
          const prefix = interval === 1 ? 'Monthly on' : `Every ${interval} months on`;
          return `${prefix} ${dayText}`;
        }
        if (byWeekday && byWeekday.length > 0 && bySetPos && bySetPos.length > 0) {
          const day = WEEKDAYS.find(w => w.value === byWeekday[0])?.label;
          const ordinal = ORDINALS.find(o => o.value === bySetPos[0])?.label;
          const prefix = interval === 1 ? 'Monthly on' : `Every ${interval} months on`;
          return `${prefix} the ${ordinal} ${day}`;
        }
        return interval === 1 ? 'Monthly' : `Every ${interval} months`;

      case 'YEARLY':
        return interval === 1 ? 'Annually' : `Every ${interval} years`;

      default:
        return 'Custom recurrence';
    }
  };

  const renderWeeklyOptions = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor="interval">Repeat every</Label>
        <Input
          id="interval"
          type="number"
          min="1"
          max="52"
          value={rule.interval}
          onChange={(e) => updateRule({ interval: parseInt(e.target.value) || 1 })}
          className="w-20"
        />
        <span>week{rule.interval > 1 ? 's' : ''}</span>
      </div>

      <div>
        <Label>On days:</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {WEEKDAYS.map((day) => (
            <Button
              key={day.value}
              size="sm"
              variant={rule.byWeekday?.includes(day.value) ? "default" : "outline"}
              onClick={() => {
                const currentDays = rule.byWeekday || [];
                const newDays = currentDays.includes(day.value)
                  ? currentDays.filter(d => d !== day.value)
                  : [...currentDays, day.value];
                updateRule({ byWeekday: newDays.length > 0 ? newDays : [day.value] });
              }}
              className="w-8 h-8 p-0"
            >
              {day.short}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMonthlyOptions = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor="interval">Repeat every</Label>
        <Input
          id="interval"
          type="number"
          min="1"
          max="12"
          value={rule.interval}
          onChange={(e) => updateRule({ interval: parseInt(e.target.value) || 1 })}
          className="w-20"
        />
        <span>month{rule.interval > 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-3">
        <Label>Repeat by:</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="byDay"
              name="monthlyType"
              checked={!!(rule.byMonthDay && rule.byMonthDay.length > 0)}
              onChange={() => {
                const dayOfMonth = startDate ? new Date(startDate).getDate() : 1;
                updateRule({ 
                  byMonthDay: [dayOfMonth],
                  byWeekday: undefined,
                  bySetPos: undefined
                });
              }}
            />
            <Label htmlFor="byDay">Day of month</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="byWeekday"
              name="monthlyType"
              checked={!!(rule.byWeekday && rule.byWeekday.length > 0 && rule.bySetPos)}
              onChange={() => {
                if (startDate) {
                  const date = new Date(startDate);
                  const weekday = WEEKDAYS[date.getDay()].value;
                  const week = Math.ceil(date.getDate() / 7);
                  const setPos = week > 4 ? -1 : week;
                  updateRule({
                    byWeekday: [weekday],
                    bySetPos: [setPos],
                    byMonthDay: undefined
                  });
                }
              }}
            />
            <Label htmlFor="byWeekday">Day of week</Label>
          </div>
        </div>

        {rule.byWeekday && rule.bySetPos && (
          <div className="flex space-x-2 ml-6">
            <Select
              value={rule.bySetPos[0]?.toString()}
              onValueChange={(value) => updateRule({ bySetPos: [parseInt(value)] })}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDINALS.map(ord => (
                  <SelectItem key={ord.value} value={ord.value.toString()}>
                    {ord.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={rule.byWeekday[0]}
              onValueChange={(value) => updateRule({ byWeekday: [value] })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WEEKDAYS.map(day => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );

  const renderYearlyOptions = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor="interval">Repeat every</Label>
        <Input
          id="interval"
          type="number"
          min="1"
          max="10"
          value={rule.interval}
          onChange={(e) => updateRule({ interval: parseInt(e.target.value) || 1 })}
          className="w-20"
        />
        <span>year{rule.interval > 1 ? 's' : ''}</span>
      </div>

      <div>
        <Label>In months:</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {MONTHS.map((month) => (
            <Button
              key={month.value}
              size="sm"
              variant={rule.byMonth?.includes(month.value) ? "default" : "outline"}
              onClick={() => {
                const currentMonths = rule.byMonth || [new Date(startDate || new Date()).getMonth() + 1];
                const newMonths = currentMonths.includes(month.value)
                  ? currentMonths.filter(m => m !== month.value)
                  : [...currentMonths, month.value];
                updateRule({ byMonth: newMonths.length > 0 ? newMonths : [month.value] });
              }}
              className="text-xs"
            >
              {month.label.slice(0, 3)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEndOptions = () => (
    <div className="space-y-3">
      <Label>Ends:</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="never"
            name="endType"
            checked={!rule.count && !rule.until}
            onChange={() => updateRule({ count: undefined, until: undefined })}
          />
          <Label htmlFor="never">Never</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="after"
            name="endType"
            checked={!!rule.count}
            onChange={() => updateRule({ count: 10, until: undefined })}
          />
          <Label htmlFor="after">After</Label>
          {rule.count !== undefined && (
            <>
              <Input
                type="number"
                min="1"
                max="999"
                value={rule.count}
                onChange={(e) => updateRule({ count: parseInt(e.target.value) || 1 })}
                className="w-20"
              />
              <span>occurrences</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="until"
            name="endType"
            checked={!!rule.until}
            onChange={() => {
              const futureDate = new Date();
              futureDate.setFullYear(futureDate.getFullYear() + 1);
              updateRule({ 
                until: futureDate.toISOString().split('T')[0], 
                count: undefined 
              });
            }}
          />
          <Label htmlFor="until">On</Label>
          {rule.until && (
            <Input
              type="date"
              value={rule.until}
              onChange={(e) => updateRule({ until: e.target.value })}
              className="w-40"
            />
          )}
        </div>
      </div>
    </div>
  );

  if (!isRecurring) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Repeat className="h-5 w-5 text-gray-400" />
            <div>
              <div className="font-medium">Repeat Event</div>
              <div className="text-sm text-gray-500">Make this a recurring event</div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => handleRecurrenceToggle(true)}
            disabled={disabled}
          >
            Add Recurrence
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Repeat className="h-5 w-5" />
            <span>Repeat Event</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRecurrenceToggle(false)}
            disabled={disabled}
          >
            Remove
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          {getRecurrenceDescription()}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Select
            value={rule.frequency}
            onValueChange={(value) => updateRule({ 
              frequency: value as RecurrenceRule['frequency'],
              byWeekday: value === 'WEEKLY' ? rule.byWeekday || ['MO'] : undefined,
              byMonthDay: undefined,
              byMonth: value === 'YEARLY' ? [new Date(startDate || new Date()).getMonth() + 1] : undefined,
              bySetPos: undefined
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {rule.frequency === 'DAILY' && (
          <div className="flex items-center space-x-2">
            <Label htmlFor="interval">Repeat every</Label>
            <Input
              id="interval"
              type="number"
              min="1"
              max="365"
              value={rule.interval}
              onChange={(e) => updateRule({ interval: parseInt(e.target.value) || 1 })}
              className="w-20"
            />
            <span>day{rule.interval > 1 ? 's' : ''}</span>
          </div>
        )}

        {rule.frequency === 'WEEKLY' && renderWeeklyOptions()}
        {rule.frequency === 'MONTHLY' && renderMonthlyOptions()}
        {rule.frequency === 'YEARLY' && renderYearlyOptions()}

        <Separator />
        
        {renderEndOptions()}
      </CardContent>
    </Card>
  );
}