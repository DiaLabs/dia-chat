'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown, Check, Sparkles, Cpu } from 'lucide-react';

interface ModelSelectorProps {
  compact?: boolean;
}

export default function ModelSelector({ compact }: ModelSelectorProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button 
        className={compact 
          ? "flex items-center justify-center p-2 rounded-full text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/20"
          : "flex items-center justify-between w-full md:w-auto gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-2 md:py-1.5 rounded-full transition-colors outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/20"
        }
      >
        {compact ? (
          <Cpu className="w-4 h-4" />
        ) : (
          <>
            <span className="truncate">dia-genz-v0.1.0-1b-it-4bit</span>
            <ChevronDown className="w-3 h-3 text-neutral-400 flex-shrink-0" />
          </>
        )}
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
        <Menu.Items className="absolute right-0 top-full mt-2 w-64 origin-top-right divide-y divide-neutral-100 dark:divide-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50">
          <div className="p-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-[rgb(var(--primary))]/10 dark:bg-[rgb(var(--primary))]/20' : ''
                  } group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs`}
                >
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="font-semibold text-neutral-900 dark:text-white">dia-genz-v0.1.0</span>
                    <span className="text-neutral-500 dark:text-neutral-400 font-mono text-[10px]">1b-it-4bit (Active)</span>
                  </div>
                  <Check className="w-4 h-4 text-[rgb(var(--primary))]" />
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="p-1">
            <Menu.Item disabled>
              <button
                className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs opacity-50 cursor-not-allowed"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-semibold text-neutral-900 dark:text-white">dia-genz-v1.0</span>
                  <span className="text-neutral-500 dark:text-neutral-400 font-mono text-[10px]">Coming Soon</span>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
