export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Friendly chat bubble with heart - line art style */}
      <path
        d="M8 12C8 8.68629 10.6863 6 14 6H26C29.3137 6 32 8.68629 32 12V22C32 25.3137 29.3137 28 26 28H22L16 34V28H14C10.6863 28 8 25.3137 8 22V12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Heart inside bubble */}
      <path
        d="M20 22C20 22 24 18.5 24 16C24 14.3431 22.6569 13 21 13C20.2316 13 19.5308 13.3374 19 13.8906C18.4692 13.3374 17.7684 13 17 13C15.3431 13 14 14.3431 14 16C14 18.5 18 22 20 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
