import { useId } from "react";

interface LogoProps {
  size?: number;
  withText?: boolean;
}

/** 로고의 전원 아이콘(그린 → 골드 그라데이션)을 SVG로 옮긴 마크 */
export function LogoMark({ size = 32 }: { size?: number }) {
  const gradientId = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        {/* userSpaceOnUse: 폭이 0인 세로선에도 그라데이션이 적용되도록 */}
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="8"
          y1="6"
          x2="32"
          y2="34"
        >
          <stop offset="0%" stopColor="#54E866" />
          <stop offset="55%" stopColor="#3DC853" />
          <stop offset="100%" stopColor="#E3AE38" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="#173B28" />
      <path
        d="M13.4 13.2a10 10 0 1 0 13.2 0"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M20 8.5v10"
        stroke={`url(#${gradientId})`}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo({ size = 26, withText = true }: LogoProps) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark size={size} />
      {withText && (
        <span className="text-[15px] font-bold tracking-tight text-ink">
          on &amp; off
        </span>
      )}
    </span>
  );
}
