'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PasswordStrength from '@/components/ui/PasswordStrength';
import { usePasswordSetup } from '@/context/PasswordSetupContext';
import { useToast } from '@/context/ToastContext';

// Zod schemas for form validation
const createPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Kata sandi harus minimal 8 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Kata sandi tidak cocok",
  path: ["confirmPassword"],
});

type CreatePasswordFormData = z.infer<typeof createPasswordSchema>;

interface PasswordSetupModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

type Step = 'choice' | 'create' | 'confirm';

const PasswordSetupModal: React.FC<PasswordSetupModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [step, setStep] = useState<Step>('choice');
  const { userInfo, setupPassword, completeSetup, isSubmitting, error, setError } = usePasswordSetup();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<CreatePasswordFormData>({
    resolver: zodResolver(createPasswordSchema),
    mode: 'onChange',
  });

  const newPassword = watch('newPassword', '');

  // Handle choice selection
  const handleChoice = (choice: 'change' | 'keep') => {
    setError(null);
    
    if (choice === 'change') {
      setStep('create');
    } else {
      setStep('confirm');
    }
  };

  // Handle password creation
  const handleCreatePassword = async (data: CreatePasswordFormData) => {
    try {
      await setupPassword({
        action: 'change',
        new_password: data.newPassword,
      });
      
      await completeSetup();
      showToast('Kata sandi berhasil dibuat!', 'success');
      onComplete();
    } catch (err: any) {
      showToast(err.message || 'Gagal membuat kata sandi', 'error');
    }
  };

  // Handle keep current password
  const handleKeepPassword = async () => {
    try {
      await setupPassword({
        action: 'keep',
      });
      
      await completeSetup();
      showToast('Pengaturan kata sandi selesai!', 'success');
      onComplete();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyelesaikan pengaturan', 'error');
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === 'create' || step === 'confirm') {
      setStep('choice');
      setError(null);
      reset();
    }
  };

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const slideVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
  };

  // Progress indicator
  const ProgressSteps = () => {
    const steps: Step[] = ['choice', 'create', 'confirm'];
    const currentIndex = steps.indexOf(step);
    
    return (
      <div className="flex justify-center mb-6">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full mx-1 transition-colors ${
              index <= currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Keyboard event handler
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Don't allow escape during password setup - user must complete it
        return;
      }
      if (e.key === 'Enter' && step === 'choice') {
        e.preventDefault(); // Prevent form submission if inside a form
      }
    };

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const modal = document.querySelector('[data-password-setup-modal]');
        if (!modal) return;
        
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (!firstElement) return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keydown', handleFocusTrap);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keydown', handleFocusTrap);
    };
  }, [isOpen, step]);

  // Screen reader announcements
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  // Announce step changes to screen readers
  React.useEffect(() => {
    if (!isOpen) return;
    
    let message = '';
    switch (step) {
      case 'choice':
        message = 'Pengaturan kata sandi: Pilih cara mengatur kata sandi Anda';
        break;
      case 'create':
        message = 'Pengaturan kata sandi: Buat kata sandi baru Anda';
        break;
      case 'confirm':
        message = 'Pengaturan kata sandi: Konfirmasi tetap menggunakan kata sandi tanggal lahir';
        break;
    }
    
    if (message) {
      setTimeout(() => announceToScreenReader(message), 100);
    }
  }, [step, isOpen]);

  if (!isOpen || !userInfo) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        aria-modal="true"
        role="dialog"
        aria-labelledby="password-setup-title"
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto sm:max-w-lg relative"
          data-password-setup-modal
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-6">
            <ProgressSteps />
            
            <AnimatePresence mode="wait">
              {step === 'choice' && (
                <motion.div
                  key="choice"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="text-center">
                    <div className="mb-4">
                      <h2 
                        id="password-setup-title"
                        className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
                      >
                        🎉 Selamat Datang di Every Nation!
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Kabar baik! Anda telah ditugaskan ke sebuah pelayanan.
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                      <p className="text-blue-800 text-sm mb-2 sm:mb-3">
                        Untuk keamanan Anda, pilih salah satu:
                      </p>
                      <div className="space-y-1.5 sm:space-y-2 text-left">
                        <div className="flex items-center">
                          <span className="mr-2 text-base" aria-hidden="true">🔒</span>
                          <span className="text-xs sm:text-sm">Buat kata sandi yang aman</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2 text-base" aria-hidden="true">📅</span>
                          <span className="text-xs sm:text-sm">Tetap gunakan kata sandi tanggal lahir</span>
                        </div>
                      </div>
                    </div>

                    {userInfo.default_password_hint && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
                        <p className="text-gray-600 text-sm">
                          <strong>Petunjuk kata sandi saat ini:</strong>
                        </p>
                        <p className="text-gray-800 text-sm">
                          {userInfo.default_password_hint}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2 sm:space-y-3">
                      <Button
                        onClick={() => handleChoice('change')}
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-2 sm:py-3"
                        aria-describedby="create-password-desc"
                      >
                        <span aria-hidden="true">🔐</span> Buat Kata Sandi Baru
                      </Button>
                      <div id="create-password-desc" className="sr-only">
                        Buat kata sandi baru yang aman untuk mengganti kata sandi tanggal lahir Anda
                      </div>
                      <Button
                        onClick={() => handleChoice('keep')}
                        disabled={isSubmitting}
                        variant="outline"
                        className="w-full text-sm sm:text-base py-2 sm:py-3"
                        aria-describedby="keep-password-desc"
                      >
                        <span aria-hidden="true">📅</span> Tetap Gunakan Tanggal Lahir
                      </Button>
                      <div id="keep-password-desc" className="sr-only">
                        Lanjutkan menggunakan tanggal lahir Anda sebagai kata sandi
                      </div>
                    </div>

                    {error && (
                      <div className="mt-3 sm:mt-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
                        <p className="text-red-600 text-xs sm:text-sm">{error}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 'create' && (
                <motion.div
                  key="create"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div>
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        🔐 Buat Kata Sandi Aman Anda
                      </h2>
                      <p className="text-gray-600">
                        Pilih kata sandi yang kuat untuk melindungi akun Anda
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(handleCreatePassword)} className="space-y-3 sm:space-y-4" noValidate>
                      <div>
                        <label 
                          htmlFor="new-password-input"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Kata Sandi Baru
                        </label>
                        <Input
                          id="new-password-input"
                          type="password"
                          {...register('newPassword')}
                          placeholder="Masukkan kata sandi baru Anda"
                          disabled={isSubmitting}
                          aria-invalid={errors.newPassword ? 'true' : 'false'}
                          aria-describedby={errors.newPassword ? 'new-password-error' : undefined}
                          autoComplete="new-password"
                        />
                        {errors.newPassword && (
                          <p id="new-password-error" className="text-red-500 text-xs mt-1" role="alert">
                            {errors.newPassword.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label 
                          htmlFor="confirm-password-input"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Konfirmasi Kata Sandi
                        </label>
                        <Input
                          id="confirm-password-input"
                          type="password"
                          {...register('confirmPassword')}
                          placeholder="Konfirmasi kata sandi baru Anda"
                          disabled={isSubmitting}
                          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                          aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                          autoComplete="new-password"
                        />
                        {errors.confirmPassword && (
                          <p id="confirm-password-error" className="text-red-500 text-xs mt-1" role="alert">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      {newPassword && (
                        <PasswordStrength password={newPassword} />
                      )}

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBack}
                          disabled={isSubmitting}
                          className="flex-1 text-sm sm:text-base"
                          aria-label="Kembali ke pilihan kata sandi"
                        >
                          <span aria-hidden="true">←</span> Kembali
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting || !isValid}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-sm sm:text-base"
                          aria-label="Atur kata sandi baru Anda"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <span className="animate-spin mr-2" aria-hidden="true">⏳</span>
                              Mengatur...
                            </span>
                          ) : (
                            <span>Atur Kata Sandi <span aria-hidden="true">→</span></span>
                          )}
                        </Button>
                      </div>

                      {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-sm">{error}</p>
                        </div>
                      )}
                    </form>
                  </div>
                </motion.div>
              )}

              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="text-center">
                    <div className="mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        <span aria-hidden="true">📅</span> Tetap Gunakan Tanggal Lahir
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Anda dapat terus menggunakan tanggal lahir sebagai kata sandi.
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <span className="text-yellow-500 mr-2 mt-0.5">💡</span>
                        <div className="text-left">
                          <p className="text-yellow-800 text-sm font-medium mb-1">
                            Ingat:
                          </p>
                          <p className="text-yellow-700 text-sm">
                            Anda dapat mengubah ini kapan saja di pengaturan profil.
                          </p>
                        </div>
                      </div>
                    </div>

                    {userInfo.default_password_hint && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
                        <p className="text-gray-800 font-medium">
                          Kata sandi Anda: {userInfo.default_password_hint}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={isSubmitting}
                        className="flex-1 text-sm sm:text-base"
                        aria-label="Kembali ke pilihan kata sandi"
                      >
                        <span aria-hidden="true">←</span> Kembali
                      </Button>
                      <Button
                        onClick={handleKeepPassword}
                        disabled={isSubmitting}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-sm sm:text-base"
                        aria-label="Tetap gunakan kata sandi tanggal lahir dan lanjutkan"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <span className="animate-spin mr-2" aria-hidden="true">⏳</span>
                            Mengatur...
                          </span>
                        ) : (
                          <span>Lanjutkan <span aria-hidden="true">→</span></span>
                        )}
                      </Button>
                    </div>

                    {error && (
                      <div className="mt-3 sm:mt-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
                        <p className="text-red-600 text-xs sm:text-sm">{error}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PasswordSetupModal;