"use client";
import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDeviceContext } from "@/context/DeviceContext";
import { ApiRequestError } from "@/lib/api";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Button, { LinkButton } from "@/components/ui/Button";

interface SwitchDraft {
  key: number;
  switchName: string;
  description: string;
  irCodeOn: string;
  irCodeOff: string;
}

function emptySwitch(key: number): SwitchDraft {
  return { key, switchName: "", description: "", irCodeOn: "", irCodeOff: "" };
}

const inputClass =
  "h-9 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-4 hover:border-ink-4 focus:border-ink-3 focus:shadow-[0_0_0_3px_rgba(18,22,19,0.08)]";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-ink-2">
        {label}
        {!required && <span className="ml-1 font-normal text-ink-4">(선택)</span>}
      </span>
      {children}
    </label>
  );
}

function FormSection({
  title,
  help,
  children,
}: {
  title: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 border-b border-line px-5 py-6 md:grid-cols-[200px_minmax(0,1fr)] md:gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        <p className="text-[13px] leading-relaxed text-ink-3">{help}</p>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

export default function CreateZoneView() {
  const router = useRouter();
  const { createZone } = useDeviceContext();
  // crypto.randomUUID는 http(비보안) 환경에서 없을 수 있어 단순 증가값을 key로 쓴다.
  const nextKey = useRef(1);

  const [deviceName, setDeviceName] = useState("");
  const [description, setDescription] = useState("");
  const [switches, setSwitches] = useState<SwitchDraft[]>(() => [emptySwitch(0)]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{
    deviceId: number;
    deviceKey: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const updateSwitch = (key: number, patch: Partial<SwitchDraft>) => {
    setSwitches((prev) =>
      prev.map((s) => (s.key === key ? { ...s, ...patch } : s)),
    );
  };

  const addSwitch = () =>
    setSwitches((prev) => [...prev, emptySwitch(nextKey.current++)]);

  const removeSwitch = (key: number) =>
    setSwitches((prev) =>
      prev.length > 1 ? prev.filter((s) => s.key !== key) : prev,
    );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await createZone({
        deviceName: deviceName.trim(),
        description: description.trim(),
        switches: switches.map((s, index) => ({
          switchNumber: index + 1,
          switchName: s.switchName.trim(),
          description: s.description.trim(),
          irCodeOn: s.irCodeOn.trim(),
          irCodeOff: s.irCodeOff.trim(),
        })),
      });
      setCreated(result);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "구역 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.deviceKey);
      setCopied(true);
    } catch {
      // 비보안(http) 환경에서는 clipboard API가 막혀 있으므로 직접 복사하도록 안내
      window.prompt("아래 deviceKey를 복사하세요", created.deviceKey);
    }
  };

  if (created) {
    return (
      <PageShell>
        <div className="mx-auto flex w-full max-w-lg flex-col overflow-hidden rounded-lg border border-line bg-surface">
          <div className="flex flex-col gap-1.5 px-6 pb-5 pt-6">
            <span className="flex items-center gap-2 text-[13px] font-medium text-on-text">
              <span className="h-2 w-2 rounded-full bg-on" />
              구역 생성 완료
            </span>
            <h1 className="text-xl font-semibold tracking-tight text-ink">
              deviceKey를 ESP32에 저장하세요
            </h1>
            <p className="text-[13px] text-ink-3">
              이 키는 지금 한 번만 표시되며 다시 확인할 수 없습니다.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 px-6 pb-6">
            <span className="text-xs text-ink-3">deviceKey</span>
            <div className="flex items-stretch overflow-hidden rounded-md border border-line-strong">
              <code className="flex-1 break-all bg-canvas px-3 py-2 font-mono text-[13px] text-ink">
                {created.deviceKey}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className={`shrink-0 border-l border-line-strong px-3.5 text-[13px] font-medium transition-colors ${
                  copied ? "bg-on-bg text-on-text" : "bg-surface text-ink hover:bg-subtle"
                }`}
              >
                {copied ? "복사됨" : "복사"}
              </button>
            </div>
          </div>

          <div className="flex justify-end border-t border-line bg-canvas px-6 py-3">
            <Button variant="primary" onClick={() => router.push("/")}>
              완료
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-3">
        <Breadcrumb current="구역 추가" />
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-ink">구역 추가</h1>
          <p className="text-[13px] text-ink-3">
            구역과 스위치를 등록하면 발급되는 deviceKey를 ESP32에 넣어 바로 연동할 수 있어요.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-lg border border-line bg-surface"
      >
        <FormSection
          title="구역 정보"
          help="대시보드 목록에 표시되는 이름과 설명입니다."
        >
          <Field label="구역 이름" required>
            <input
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              required
              placeholder="예: 1층 사무실"
              className={inputClass}
            />
          </Field>
          <Field label="설명">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 사무실 조명 및 에어컨 제어"
              className={inputClass}
            />
          </Field>
        </FormSection>

        <FormSection
          title="스위치"
          help="구역에 연결할 스위치와 리모컨 IR 코드를 입력하세요. 위에서부터 순서대로 번호가 매겨집니다."
        >
          <ol className="flex flex-col gap-3">
            {switches.map((s, index) => (
              <li key={s.key} className="overflow-hidden rounded-md border border-line">
                <div className="flex h-10 items-center justify-between border-b border-line bg-canvas px-3">
                  <span className="truncate text-[13px] font-medium text-ink-2">
                    <span className="mr-2 tabular-nums text-ink-4">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {s.switchName.trim() || `스위치 ${index + 1}`}
                  </span>
                  {switches.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSwitch(s.key)}
                      className="rounded px-1.5 py-0.5 text-xs text-ink-3 transition-colors hover:bg-danger-bg hover:text-danger"
                    >
                      삭제
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2">
                  <Field label="이름" required>
                    <input
                      value={s.switchName}
                      onChange={(e) => updateSwitch(s.key, { switchName: e.target.value })}
                      required
                      placeholder="예: 천장 조명"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="설명">
                    <input
                      value={s.description}
                      onChange={(e) => updateSwitch(s.key, { description: e.target.value })}
                      placeholder="예: 입구 쪽"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="IR ON 코드" required>
                    <input
                      value={s.irCodeOn}
                      onChange={(e) => updateSwitch(s.key, { irCodeOn: e.target.value })}
                      required
                      placeholder="0xFFA25D"
                      spellCheck={false}
                      className={`${inputClass} font-mono text-[13px]`}
                    />
                  </Field>
                  <Field label="IR OFF 코드" required>
                    <input
                      value={s.irCodeOff}
                      onChange={(e) => updateSwitch(s.key, { irCodeOff: e.target.value })}
                      required
                      placeholder="0xFFA857"
                      spellCheck={false}
                      className={`${inputClass} font-mono text-[13px]`}
                    />
                  </Field>
                </div>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={addSwitch}
            className="flex h-9 items-center justify-center rounded-md border border-dashed border-line-strong text-[13px] text-ink-2 transition-colors hover:border-ink-4 hover:bg-canvas hover:text-ink"
          >
            + 스위치 추가
          </button>
        </FormSection>

        <div className="flex flex-col-reverse gap-3 bg-canvas px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[13px] text-danger" role="alert">
            {error}
          </span>
          <div className="flex justify-end gap-2">
            <LinkButton href="/" variant="ghost">
              취소
            </LinkButton>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "생성 중…" : "구역 생성"}
            </Button>
          </div>
        </div>
      </form>
    </PageShell>
  );
}
