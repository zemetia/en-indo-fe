'use client';

import React, { useState, useEffect } from 'react';
import { Users, Baby, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export interface ParticipantData {
  expectedParticipants: number;
  expectedAdults: number;
  expectedYouth: number;
  expectedKids: number;
}

interface ParticipantPlannerProps {
  value: ParticipantData;
  onChange: (data: ParticipantData) => void;
  capacity?: number;
  className?: string;
  disabled?: boolean;
}

export function ParticipantPlanner({
  value,
  onChange,
  capacity = 99999,
  className = '',
  disabled = false
}: ParticipantPlannerProps) {
  const [inputMode, setInputMode] = useState<'total' | 'breakdown'>('total');
  const [localData, setLocalData] = useState<ParticipantData>(value);

  useEffect(() => {
    setLocalData(value);
  }, [value]);

  const handleTotalChange = (total: number) => {
    const newData = {
      ...localData,
      expectedParticipants: total,
    };
    setLocalData(newData);
    onChange(newData);
  };

  const handleBreakdownChange = (field: keyof Omit<ParticipantData, 'expectedParticipants'>, val: number) => {
    const newData = { ...localData, [field]: val };
    // Auto-calculate total from breakdown
    const newTotal = newData.expectedAdults + newData.expectedYouth + newData.expectedKids;
    newData.expectedParticipants = newTotal;
    
    setLocalData(newData);
    onChange(newData);
  };

  const handleModeSwitch = (mode: 'total' | 'breakdown') => {
    setInputMode(mode);
    if (mode === 'breakdown' && localData.expectedParticipants > 0) {
      // Distribute total into breakdown if not already set
      if (localData.expectedAdults + localData.expectedYouth + localData.expectedKids === 0) {
        const adults = Math.round(localData.expectedParticipants * 0.6); // 60% adults
        const youth = Math.round(localData.expectedParticipants * 0.25); // 25% youth
        const kids = localData.expectedParticipants - adults - youth; // remainder for kids
        
        const newData = {
          ...localData,
          expectedAdults: adults,
          expectedYouth: youth,
          expectedKids: Math.max(0, kids),
        };
        setLocalData(newData);
        onChange(newData);
      }
    }
  };

  const getCapacityUtilization = () => {
    if (capacity === 0) return 0;
    return Math.round((localData.expectedParticipants / capacity) * 100);
  };

  const getUtilizationColor = () => {
    const utilization = getCapacityUtilization();
    if (utilization < 70) return 'text-green-600';
    if (utilization < 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUtilizationBadgeColor = () => {
    const utilization = getCapacityUtilization();
    if (utilization < 70) return 'bg-green-100 text-green-800 border-green-200';
    if (utilization < 90) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const breakdownTotal = localData.expectedAdults + localData.expectedYouth + localData.expectedKids;
  const hasBreakdownMismatch = inputMode === 'breakdown' && breakdownTotal !== localData.expectedParticipants;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Expected Participants</span>
        </CardTitle>
        <div className="text-sm text-gray-600">
          Plan attendance numbers to help with logistics and venue preparation
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Input Mode Toggle */}
        <div className="flex items-center space-x-4">
          <Label className="text-sm font-medium">Input Method:</Label>
          <div className="flex rounded-lg border overflow-hidden">
            <button
              type="button"
              onClick={() => handleModeSwitch('total')}
              disabled={disabled}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                inputMode === 'total'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Total Only
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('breakdown')}
              disabled={disabled}
              className={`px-3 py-2 text-sm font-medium transition-colors border-l ${
                inputMode === 'breakdown'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              By Age Group
            </button>
          </div>
        </div>

        {/* Total Input Mode */}
        {inputMode === 'total' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="expectedTotal" className="text-sm font-medium">
                Total Expected Participants
              </Label>
              <Input
                id="expectedTotal"
                type="number"
                min="0"
                max={capacity}
                value={localData.expectedParticipants || ''}
                onChange={(e) => handleTotalChange(parseInt(e.target.value) || 0)}
                disabled={disabled}
                placeholder="Enter expected number of participants"
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Breakdown Input Mode */}
        {inputMode === 'breakdown' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="expectedAdults" className="flex items-center space-x-2 text-sm font-medium">
                  <Users className="h-4 w-4" />
                  <span>Adults (18+)</span>
                </Label>
                <Input
                  id="expectedAdults"
                  type="number"
                  min="0"
                  value={localData.expectedAdults || ''}
                  onChange={(e) => handleBreakdownChange('expectedAdults', parseInt(e.target.value) || 0)}
                  disabled={disabled}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="expectedYouth" className="flex items-center space-x-2 text-sm font-medium">
                  <TrendingUp className="h-4 w-4" />
                  <span>Youth (13-17)</span>
                </Label>
                <Input
                  id="expectedYouth"
                  type="number"
                  min="0"
                  value={localData.expectedYouth || ''}
                  onChange={(e) => handleBreakdownChange('expectedYouth', parseInt(e.target.value) || 0)}
                  disabled={disabled}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="expectedKids" className="flex items-center space-x-2 text-sm font-medium">
                  <Baby className="h-4 w-4" />
                  <span>Kids (0-12)</span>
                </Label>
                <Input
                  id="expectedKids"
                  type="number"
                  min="0"
                  value={localData.expectedKids || ''}
                  onChange={(e) => handleBreakdownChange('expectedKids', parseInt(e.target.value) || 0)}
                  disabled={disabled}
                  className="mt-1"
                />
              </div>
            </div>

            {hasBreakdownMismatch && (
              <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-amber-800">Breakdown Total: {breakdownTotal}</div>
                  <div className="text-amber-700">
                    The breakdown total will automatically update the overall expected participants count.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Summary & Capacity Analysis */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Expected:</span>
            <span className="text-lg font-bold">{localData.expectedParticipants}</span>
          </div>

          {inputMode === 'breakdown' && localData.expectedParticipants > 0 && (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-gray-500">Adults</div>
                <div className="font-medium">{localData.expectedAdults}</div>
                <div className="text-xs text-gray-400">
                  {localData.expectedParticipants > 0 
                    ? Math.round((localData.expectedAdults / localData.expectedParticipants) * 100)
                    : 0}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Youth</div>
                <div className="font-medium">{localData.expectedYouth}</div>
                <div className="text-xs text-gray-400">
                  {localData.expectedParticipants > 0 
                    ? Math.round((localData.expectedYouth / localData.expectedParticipants) * 100)
                    : 0}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Kids</div>
                <div className="font-medium">{localData.expectedKids}</div>
                <div className="text-xs text-gray-400">
                  {localData.expectedParticipants > 0 
                    ? Math.round((localData.expectedKids / localData.expectedParticipants) * 100)
                    : 0}%
                </div>
              </div>
            </div>
          )}

          {/* Capacity Utilization */}
          {capacity < 99999 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Venue Capacity:</span>
                <span className="text-sm font-medium">{capacity}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Utilization:</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getUtilizationColor()}`}>
                    {getCapacityUtilization()}%
                  </span>
                  <Badge variant="secondary" className={getUtilizationBadgeColor()}>
                    {getCapacityUtilization() < 70 ? 'Good' : getCapacityUtilization() < 90 ? 'High' : 'Over Capacity'}
                  </Badge>
                </div>
              </div>

              {/* Capacity warnings */}
              {getCapacityUtilization() >= 90 && (
                <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-red-800">Capacity Warning</div>
                    <div className="text-red-700">
                      Expected participants ({localData.expectedParticipants}) {getCapacityUtilization() > 100 ? 'exceed' : 'are very close to'} venue capacity ({capacity}). 
                      Consider a larger venue or adjusting expectations.
                    </div>
                  </div>
                </div>
              )}
              
              {getCapacityUtilization() >= 75 && getCapacityUtilization() < 90 && (
                <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-yellow-800">Planning Tip</div>
                    <div className="text-yellow-700">
                      High capacity utilization. Ensure adequate seating, parking, and facilities for comfort.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}