import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Download, X } from 'lucide-react';
import clsx from 'clsx';

interface ConsentModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  cacheDuration: number;
}

export default function ConsentModal({
  isOpen,
  onConfirm,
  onCancel,
  cacheDuration
}: ConsentModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-neutral-900/40 dark:bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl ring-1 ring-neutral-200 dark:ring-neutral-800"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[rgb(var(--primary))]/10 dark:bg-[rgb(var(--primary))]/20">
                        <Download className="w-6 h-6 text-[rgb(var(--primary))]" />
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                        Download AI Model
                    </h2>
                </div>
                <button 
                    onClick={onCancel}
                    className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="mt-4 space-y-4 text-neutral-600 dark:text-neutral-300">
              <p>
                To chat with Dia, we need to download the <strong>Dia GenZ 1B</strong> model directly to your device.
              </p>
              
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900 dark:text-white">Size:</span>
                    <span>~700 MB (One-time download)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900 dark:text-white">Storage:</span>
                    <span>Browser Cache</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900 dark:text-white">Expires:</span>
                    <span>After {cacheDuration} days of inactivity</span>
                </div>
              </div>

              <div className="flex gap-3 text-sm text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800/30">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>
                  We recommend using Wi-Fi. The model will run entirely offline on your device after download.
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-hover))] text-neutral-900 shadow-sm transition-all active:scale-95"
              >
                Download & Initialize
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
