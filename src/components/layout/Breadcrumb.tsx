import Link from "next/link";

/** "관리 구역 / 현재 페이지" 형태의 위치 표시 겸 뒤로 가기 */
export default function Breadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="현재 위치" className="flex items-center gap-1.5 text-[13px]">
      <Link href="/" className="text-ink-3 transition-colors hover:text-ink">
        관리 구역
      </Link>
      <span aria-hidden="true" className="text-ink-4">
        /
      </span>
      <span className="truncate text-ink-2">{current}</span>
    </nav>
  );
}
