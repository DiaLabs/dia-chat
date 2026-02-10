import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="110"
          height="110"
          viewBox="0 0 40 40"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 12C8 8.68629 10.6863 6 14 6H26C29.3137 6 32 8.68629 32 12V22C32 25.3137 29.3137 28 26 28H22L16 34V28H14C10.6863 28 8 25.3137 8 22V12Z" />
          <path 
            d="M20 22C20 22 24 18.5 24 16C24 14.3431 22.6569 13 21 13C20.2316 13 19.5308 13.3374 19 13.8906C18.4692 13.3374 17.7684 13 17 13C15.3431 13 14 14.3431 14 16C14 18.5 18 22 20 22Z" 
            strokeWidth="2"
            fill="white"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
