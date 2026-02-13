import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fbbf24',
};

export const metadata: Metadata = {
  title: "Dia Chat - Your Empathetic AI Companion",
  description: "A safe space for reflection and support. Dia is designed to listen, understand, and engage with you in meaningful conversations.",
  keywords: ["AI chatbot", "mental health", "wellness", "Gen Z", "companion", "emotional support"],
  authors: [{ name: "Dia Chat" }],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dia Chat',
  },
  icons: {
    icon: '/favicon-96x96.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Dia Chat",
    description: "Your empathetic AI companion for mental wellness",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
