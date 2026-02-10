import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dia Chat - Your Empathetic AI Companion',
    short_name: 'Dia Chat',
    description: 'A safe space for reflection and support. Dia is designed to listen, understand, and engage with you in meaningful conversations.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#fbbf24',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['health', 'lifestyle', 'productivity'],
    scope: '/',
  };
}
