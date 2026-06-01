import { StatusProps } from "@/entities/status/type";

export default function StatusDot({ status }: StatusProps) {
  return (
    <span
      className={`w-[6px] h-[6px] rounded-full 
        ${
          status === "on"
            ? "bg-green-10 shadow-[0_0_8px_rgba(74,222,128,0.4)]"
            : status === "partial"
              ? "bg-yellow-10"
              : "bg-text-30"
        }`}
    ></span>
  );
}
