interface SummaryCardProps {
  title: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function CardButton({
  title,
  isSelected,
  onClick,
}: SummaryCardProps) {
  return (
    <button
      className={`flex items-center border border-border-default rounded-md py-1.5 px-3.5
      text-[12px] font-sans font-medium transition-colors duration-200 ${
        isSelected
          ? "bg-surface-20 border-border-hover text-text-10"
          : "bg-surface-10 text-text-30 hover:border-border-hover hover:text-text-20"
      }`}
      onClick={onClick}
    >
      {title}
    </button>
  );
}
