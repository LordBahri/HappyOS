interface LogoProps {
  /** Show icon mark only (no text) */
  markOnly?: boolean;
  /** White wordmark for dark backgrounds */
  light?: boolean;
  className?: string;
  /** Size of the icon mark in px */
  size?: number;
}

export default function Logo({ markOnly = false, light = false, className = "", size = 32 }: LogoProps) {
  const id = `logo-grad-${size}`;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* H mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#0082c8" />
            <stop offset="100%" stopColor="#00b4d8" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill={`url(#${id})`} />
        {/* H letterform */}
        <rect x="7"  y="7"  width="5" height="18" rx="1.5" fill="white" />
        <rect x="20" y="7"  width="5" height="18" rx="1.5" fill="white" />
        <rect x="12" y="13" width="8" height="6"  rx="1.5" fill="white" />
      </svg>

      {!markOnly && (
        <span
          className="font-bold tracking-tight select-none"
          style={{ color: light ? "#ffffff" : "#0d1e42", fontSize: size * 0.5, lineHeight: 1 }}
        >
          HappyOS
        </span>
      )}
    </span>
  );
}
