'use client';

import React from 'react';
import { authService } from '@/lib/auth-service';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, className = '' }) => {
  const validation = authService.validatePassword(password);
  
  const getStrengthColor = (score: number): string => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthText = (score: number): string => {
    switch (score) {
      case 0:
        return 'Sangat Lemah';
      case 1:
        return 'Lemah';
      case 2:
        return 'Sedang';
      case 3:
        return 'Baik';
      case 4:
        return 'Kuat';
      default:
        return '';
    }
  };

  const strengthColor = getStrengthColor(validation.score);
  const strengthText = getStrengthText(validation.score);
  const strengthPercentage = (validation.score / 4) * 100;

  return (
    <div className={`password-strength ${className}`}>
      {/* Strength Bar */}
      <div className="mb-2 sm:mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs sm:text-sm text-gray-600">Kekuatan Kata Sandi</span>
          <span className={`text-xs sm:text-sm font-medium ${
            validation.score >= 3 ? 'text-green-600' :
            validation.score >= 2 ? 'text-yellow-600' :
            'text-red-600'
          }`} aria-live="polite">
            {strengthText}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${strengthColor}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-0.5 sm:space-y-1">
        {validation.requirements.map((requirement) => (
          <div
            key={requirement.id}
            className="flex items-center space-x-2 text-xs sm:text-sm"
          >
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
              requirement.met 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              {requirement.met ? '✓' : '○'}
            </div>
            <span className={requirement.met ? 'text-green-600' : 'text-gray-500'}>
              {requirement.text}
            </span>
          </div>
        ))}
      </div>

      {/* Feedback */}
      {validation.feedback.length > 0 && password.length > 0 && (
        <div className="mt-2 sm:mt-3 p-2 bg-orange-50 border border-orange-200 rounded-md">
          <div className="text-xs sm:text-sm text-orange-700">
            <strong>Saran:</strong>
            <ul className="mt-1 list-disc list-inside space-y-0.5">
              {validation.feedback.map((feedback, index) => (
                <li key={index} className="text-xs sm:text-sm">{feedback}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;