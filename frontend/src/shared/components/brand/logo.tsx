import { cn } from "@/shared/lib/utils";

/**
 * Brand mark: a terminal prompt "›" with a blinking sodium cursor inside a soft rounded frame —
 * the console the whole site is built around. The cursor loops; the chevron nudges on hover.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={cn("logo-mark", className)} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="logo-frame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="29" height="29" rx="9" fill="#111214" stroke="url(#logo-frame)" strokeWidth="1.5" />
      <path className="logo-mark__chevron" d="M9.5 11l5 5-5 5" fill="none" stroke="#f4f4f1" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect className="logo-mark__cursor" x="16.5" y="19" width="7" height="2.6" rx="1.3" fill="#ffd43b" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("logo", className)}>
      <LogoMark />
      <span className="logo__word">
        andre<span className="logo__word-muted">deomondes</span>
      </span>
    </span>
  );
}
