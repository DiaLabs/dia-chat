'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle, Radio, RadioGroup } from '@headlessui/react';
import { X, Sun, Moon, Monitor, Trash2, AlertTriangle, Cpu, Check, Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAppSettings } from '@/context/AppSettingsContext';
import { LLMService } from '@/services/LLMService';
import { ACTIVE_MODEL } from '@/config/llm';
import clsx from 'clsx';
import type { Theme, AccentColor, FontSize } from '@/types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshChats?: () => void;
}

const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

const accentColors: { value: AccentColor; label: string; colorClass: string }[] = [
  { value: 'yellow', label: 'Yellow', colorClass: 'bg-amber-400' },
  { value: 'blue', label: 'Blue', colorClass: 'bg-blue-500' },
  { value: 'green', label: 'Green', colorClass: 'bg-green-500' },
  { value: 'pink', label: 'Pink', colorClass: 'bg-pink-500' },
  { value: 'orange', label: 'Orange', colorClass: 'bg-orange-500' },
];

const fontSizes: { value: FontSize; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const cacheDurations: { value: number; label: string }[] = [
  { value: 1, label: '1 day' },
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
];

export default function Settings({ isOpen, onClose, onRefreshChats }: SettingsProps) {
  const { theme, setTheme } = useTheme();
  const { accentColor, setAccentColor, fontSize, setFontSize, cacheDuration, setCacheDuration, clearCache, clearAllData } = useAppSettings();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [modelCacheClearing, setModelCacheClearing] = useState(false);
  const [modelCacheCleared, setModelCacheCleared] = useState(false);

  const handleClearCache = async () => {
    await clearCache();
    setShowClearConfirm(false);
    onRefreshChats?.(); // Refresh chat list
    onClose();
  };

  const handleClearAllData = async () => {
    await clearAllData();
    setShowResetConfirm(false);
    onRefreshChats?.(); // Refresh chat list
    onClose();
  };

  const handleClearModelCache = async () => {
    try {
      setModelCacheClearing(true);
      setModelCacheCleared(false);
      console.log('Starting model cache deletion...');
      
      await LLMService.getInstance().clearCache();
      
      setModelCacheClearing(false);
      setModelCacheCleared(true);
      console.log('Model cache deleted successfully!');
      
      // Reset success message after 3 seconds
      setTimeout(() => setModelCacheCleared(false), 3000);
    } catch (e) {
      console.error('Failed to clear model cache:', e);
      setModelCacheClearing(false);
      setModelCacheCleared(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-60" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-6 shadow-2xl border border-neutral-200/50 dark:border-neutral-800/50">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-white">
                    Settings
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Theme - Sliding Pill */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                      Theme
                    </label>
                    <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                      {themes.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setTheme(option.value)}
                          className={clsx(
                            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-full transition-all text-sm font-medium cursor-pointer',
                            theme === option.value
                              ? 'bg-white dark:bg-neutral-700 shadow-sm text-[rgb(var(--primary))]'
                              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                          )}
                        >
                          <option.icon className="w-4 h-4" />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color - Compact */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      {accentColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setAccentColor(color.value)}
                          className={clsx(
                            'relative w-10 h-10 rounded-full transition-all cursor-pointer',
                            color.colorClass,
                            accentColor === color.value
                              ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900 ring-neutral-400 scale-110'
                              : 'hover:scale-105'
                          )}
                        >
                          {accentColor === color.value && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white dark:text-neutral-900" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size - Sliding Pill */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                      Font Size
                    </label>
                    <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                      {fontSizes.map((size) => (
                        <button
                          key={size.value}
                          onClick={() => setFontSize(size.value)}
                          className={clsx(
                            'flex-1 px-4 py-2 rounded-full transition-all text-sm font-medium cursor-pointer',
                            fontSize === size.value
                              ? 'bg-white dark:bg-neutral-700 shadow-sm text-[rgb(var(--primary))]'
                              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                          )}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cache Duration - Sliding Pill */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                      Cache Duration
                    </label>
                    <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                      {cacheDurations.map((duration) => (
                        <button
                          key={duration.value}
                          onClick={() => setCacheDuration(duration.value)}
                          className={clsx(
                            'flex-1 px-3 py-2 rounded-full transition-all text-sm font-medium whitespace-nowrap cursor-pointer',
                            cacheDuration === duration.value
                              ? 'bg-white dark:bg-neutral-700 shadow-sm text-[rgb(var(--primary))]'
                              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                          )}
                        >
                          {duration.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Model - Compact */}
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[rgb(var(--primary))]/10 dark:bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 dark:border-[rgb(var(--primary))]/30">
                      <Cpu className="w-5 h-5 text-[rgb(var(--primary-hover))] dark:text-[rgb(var(--primary))] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400 truncate">
                          {ACTIVE_MODEL.name} v{ACTIVE_MODEL.version} ({ACTIVE_MODEL.quantization})
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500">
                          {ACTIVE_MODEL.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Data Management - Side by Side at Bottom */}
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                      Data Management
                    </label>
                    
                    {!showClearConfirm && !showResetConfirm ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setShowClearConfirm(true)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          Clear Chats
                        </button>
                        <button
                          onClick={() => setShowResetConfirm(true)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium transition-all cursor-pointer"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Reset All
                        </button>

                        <button
                          onClick={handleClearModelCache}
                          disabled={modelCacheClearing}
                          className={`col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                            modelCacheCleared
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                              : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          {modelCacheClearing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Clearing...
                            </>
                          ) : modelCacheCleared ? (
                            <>
                              <Check className="w-4 h-4" />
                              Cleared!
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Delete Model Cache ({ACTIVE_MODEL.size})
                            </>
                          )}
                        </button>
                      </div>
                    ) : showClearConfirm ? (
                      <div className="p-4 rounded-2xl bg-[rgb(var(--primary))]/10 dark:bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 dark:border-[rgb(var(--primary))]/30">
                        <p className="text-sm text-neutral-900 dark:text-neutral-100 mb-3 font-medium">
                          Clear chats older than {cacheDuration} days?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleClearCache}
                            className="flex-1 px-4 py-2 rounded-full bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-hover))] text-neutral-900 text-sm font-semibold transition-all cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setShowClearConfirm(false)}
                            className="flex-1 px-4 py-2 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 text-sm font-semibold transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-900 dark:text-red-100 mb-3 font-medium">
                          Delete all chats and reset settings?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleClearAllData}
                            className="flex-1 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all cursor-pointer"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => setShowResetConfirm(false)}
                            className="flex-1 px-4 py-2 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 text-sm font-semibold transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
