interface SwitchProps {
  isOn: boolean;
  onClick: () => void;
  label?: string;
}

export default function Switch({ isOn, onClick, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-150
        ${isOn ? "bg-on" : "bg-line-strong hover:bg-ink-4"}`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white shadow-[0_1px_2px_rgba(18,22,19,0.25)] transition-transform duration-150 ease-out ${
          isOn ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}
