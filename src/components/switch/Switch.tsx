interface SwitchProps {
  isOn: boolean;
  onClick: () => void;
}

export default function Switch({ isOn, onClick }: SwitchProps) {
  return (
    <div
      className={`flex items-center px-[3px] py-[2px] w-11 h-[25px] border rounded-full relative 
      transition-colors duration-200 hover:cursor-pointer
      ${isOn ? "bg-green-10 border-green-10 shadow-[0_0_8px_rgba(74,222,128,0.4)]" : "bg-border-hover border-border-default"}`}
      onClick={onClick}
    >
      <div
        className={`w-[19px] h-[19px] rounded-full bg-white absolute transition-transform duration-220 ease-[cubic-bezier(.34,1.56,.64,1)] 
        ${isOn ? "translate-x-4.5" : "translate-x-0"}`}
      ></div>
    </div>
  );
}
