'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown, Check, Sparkles, Loader2, Download, CheckCircle } from 'lucide-react';
import { MODELS, ACTIVE_MODEL } from '@/config/llm';

interface ModelSelectorProps {
  compact?: boolean;
  isLoading?: boolean;
  isReady?: boolean;
  isCached?: boolean;
  progress?: number;
  progressText?: string;
  onDownload?: () => void;
  onCancel?: () => void;
}

export default function ModelSelector({
  compact,
  isLoading,
  isReady,
  isCached,
  progress = 0,
  progressText = 'Loading...',
  onDownload,
  onCancel,
}: ModelSelectorProps) {
  // Only show download button if model is NOT cached, NOT ready, and NOT loading
  const showDownloadButton = !isReady && !isLoading && !isCached;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className={
          compact
            ? 'relative overflow-hidden flex items-center justify-center p-2 rounded-full text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/20 cursor-pointer'
            : 'relative overflow-hidden flex items-center justify-between w-full md:w-auto gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-2 md:py-1.5 rounded-full transition-colors outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/20 cursor-pointer'
        }
      >
        {/* Progress fill background */}
        {isLoading && (
          <div
            className="absolute inset-0 bg-[rgb(var(--primary))]/20 dark:bg-[rgb(var(--primary))]/10 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex items-center gap-2 w-full">
          {compact ? (
            isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[rgb(var(--primary))]" />
            ) : isReady ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : isCached ? (
              <CheckCircle className="w-4 h-4 text-blue-500" />
            ) : (
              <Download className="w-4 h-4" />
            )
          ) : (
            <>
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[rgb(var(--primary))]" />
              ) : isReady ? (
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              ) : isCached ? (
                <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span className="truncate flex-1">
                {isLoading 
                  ? `${Math.round(progress)}%` 
                  : isReady 
                  ? ACTIVE_MODEL.name 
                  : isCached 
                  ? 'Model Cached' 
                  : ACTIVE_MODEL.name}
              </span>
              {isLoading && onCancel ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel();
                  }}
                  className="p-0.5 hover:bg-red-500/20 rounded transition-colors cursor-pointer"
                  title="Cancel download"
                >
                  <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              ) : (
                <ChevronDown className="w-3 h-3 text-neutral-400 shrink-0" />
              )}
            </>
          )}
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 top-full mt-2 w-72 origin-top-right divide-y divide-neutral-100 dark:divide-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50">
          {/* Download Button Section */}
          {showDownloadButton && (
            <div className="p-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDownload?.();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-hover))] text-neutral-900 font-semibold rounded-lg transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Model ({ACTIVE_MODEL.size})
              </button>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 text-center mt-2">
                Model will be cached for offline use
              </p>
            </div>
          )}

          {/* Progress Bar Section - Show when loading */}


          {/* Ready & Cached Status Banners Removed */}

          {/* Model List */}
          {MODELS.map((model) => (
            <div key={model.id} className="p-1">
              {model.status === 'coming_soon' ? (
                <Menu.Item disabled>
                  <button className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs opacity-50 cursor-not-allowed">
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-semibold text-neutral-900 dark:text-white">{model.name}</span>
                      <span className="text-neutral-500 dark:text-neutral-400 font-mono text-[10px]">
                        {model.description}
                      </span>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </Menu.Item>
              ) : (
                <Menu.Item>
                  {({ active }) => {
                    // Check if this model is the currently active/loading one
                    const isActiveModel = model.id === ACTIVE_MODEL.id;
                    const showLoading = isActiveModel && isLoading;
                    const showReady = isActiveModel && isReady;
                    const showCached = isActiveModel && isCached;

                    return (
                      <div
                        className={`${
                          active ? 'bg-neutral-100 dark:bg-neutral-800' : ''
                        } group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs relative overflow-hidden`}
                      >
                        {/* Loading Progress Background Fill */}
                        {showLoading && (
                          <div 
                            className="absolute inset-y-0 left-0 bg-[rgb(var(--primary))]/10 transition-all duration-300 ease-out z-0"
                            style={{ width: `${progress}%` }}
                          />
                        )}

                        <div className="flex flex-col items-start gap-0.5 relative z-10">
                          <span className="font-semibold text-neutral-900 dark:text-white">{model.name}</span>
                          <span className="text-neutral-500 dark:text-neutral-400 font-mono text-[10px]">
                            {showLoading 
                              ? `Loading... ${Math.round(progress)}%`
                              : `${model.quantization || ''} • ${showCached ? 'Cached' : 'Not downloaded'}`
                            }
                          </span>
                        </div>
                        
                        <div className="relative z-10">
                          {showLoading ? (
                             <Loader2 className="w-4 h-4 animate-spin text-[rgb(var(--primary))]" />
                          ) : showReady ? (
                             <Check className="w-4 h-4 text-[rgb(var(--primary))]" />
                          ) : null}
                        </div>
                      </div>
                    );
                  }}
                </Menu.Item>
              )}
            </div>
          ))}


        </Menu.Items>
      </Transition>
    </Menu>
  );
}
