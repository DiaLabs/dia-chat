import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f59e0b', // amber-500
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Friendly chat bubble */}
          <path d="M8 12C8 8.68629 10.6863 6 14 6H26C29.3137 6 32 8.68629 32 12V22C32 25.3137 29.3137 28 26 28H22L16 34V28H14C10.6863 28 8 25.3137 8 22V12Z" />
          {/* Heart inside */}
          <path 
            d="M20 22C20 22 24 18.5 24 16C24 14.3431 22.6569 13 21 13C20.2316 13 19.5308 13.3374 19 13.8906C18.4692 13.3374 17.7684 13 17 13C15.3431 13 14 14.3431 14 16C14 18.5 18 22 20 22Z" 
            strokeWidth="2.5"
            fill="currentColor"
          />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
