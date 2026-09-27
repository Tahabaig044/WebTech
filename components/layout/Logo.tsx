export default function Logo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="WebTech Solutions Hub logo"
    >
      <rect width="48" height="48" rx="12" fill="url(#logo-gradient)" />
      <path
        d="M14 16h6l-4 8h6l-8 12 2-8h-6l4-12z"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <path
        d="M24 16h6l-4 8h6l-8 12 2-8h-6l4-12z"
        fill="#FFFFFF"
        opacity="0.7"
      />
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
}
