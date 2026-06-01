import { StatusProps } from "@/entities/status/type";

export default function ZoneDot({ status }: StatusProps) {
  return (
    <span
      className={`w-[8px] h-[8px] rounded-full 
        ${
          status === "on"
            ? "bg-green-10"
            : status === "partial"
              ? "bg-yellow-10"
              : "bg-surface-20 border border-border-hover"
        }`}
    ></span>
  );
}
