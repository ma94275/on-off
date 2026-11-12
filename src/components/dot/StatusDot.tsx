import { StatusProps } from "@/entities/status/type";

export default function StatusDot({ status }: StatusProps) {
  return (
    <span
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${
        status === "on"
          ? "bg-on"
          : status === "partial"
            ? "bg-partial"
            : "bg-off"
      }`}
    />
  );
}
