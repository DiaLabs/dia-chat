import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-content', // Critical for mobile keyboard
  themeColor: '#fbbf24',
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-amber-50 dark:bg-neutral-950">
      {/* 
        This layout is specific to the Chat interface.
        It enforces:
        1. Full viewport height (100dvh)
        2. No global scrolling (overflow-hidden)
        3. Strict viewport settings (no scaling, resize content on keyboard)
      */}
      {children}
    </div>
  );
}
