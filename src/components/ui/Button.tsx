import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const VARIANT: Record<Variant, string> = {
  // 화면당 1개 정도의 핵심 동작
  primary:
    "bg-ink text-white hover:bg-ink/85 disabled:bg-ink/40",
  // 일반 동작
  secondary:
    "border border-line-strong bg-surface text-ink hover:bg-subtle disabled:text-ink-4",
  // 보조 동작 (텍스트에 가까움)
  ghost: "text-ink-2 hover:bg-subtle hover:text-ink disabled:text-ink-4",
  // 파괴적 동작
  danger:
    "border border-line bg-surface text-danger hover:border-danger-line hover:bg-danger-bg disabled:opacity-50",
};

const SIZE: Record<Size, string> = {
  sm: "h-8 px-2.5 text-[13px] gap-1.5",
  md: "h-9 px-3.5 text-sm gap-2",
};

function classes(variant: Variant, size: Size, extra = "") {
  return `inline-flex shrink-0 items-center justify-center rounded-md font-medium transition-colors disabled:cursor-not-allowed ${VARIANT[variant]} ${SIZE[size]} ${extra}`;
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

export default function Button({
  variant = "secondary",
  size = "md",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={classes(variant, size, className)} {...rest} />
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function LinkButton({
  variant = "secondary",
  size = "md",
  className,
  ...rest
}: LinkButtonProps) {
  return <Link className={classes(variant, size, className)} {...rest} />;
}
