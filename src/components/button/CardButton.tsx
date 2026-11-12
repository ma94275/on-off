interface CardButtonProps {
  title: string;
  isSelected: boolean;
  onClick: () => void;
}

/** 세그먼트 컨트롤의 한 칸 */
export default function CardButton({
  title,
  isSelected,
  onClick,
}: CardButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={`h-7 rounded px-2.5 text-[13px] transition-colors ${
        isSelected
          ? "bg-surface font-medium text-ink shadow-[0_1px_2px_rgba(18,22,19,0.08)]"
          : "text-ink-3 hover:text-ink"
      }`}
    >
      {title}
    </button>
  );
}
