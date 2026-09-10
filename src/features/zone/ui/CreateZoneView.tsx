"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDeviceContext } from "@/context/DeviceContext";
import { ApiRequestError } from "@/lib/api";
import BackButton from "@/components/button/BackButton";

interface SwitchDraft {
  key: string;
  switchName: string;
  description: string;
  irCodeOn: string;
  irCodeOff: string;
}

function emptySwitch(): SwitchDraft {
  return {
    key: crypto.randomUUID(),
    switchName: "",
    description: "",
    irCodeOn: "",
    irCodeOff: "",
  };
}

export default function CreateZoneView() {
  const router = useRouter();
  const { createZone } = useDeviceContext();

  const [deviceName, setDeviceName] = useState("");
  const [description, setDescription] = useState("");
  const [switches, setSwitches] = useState<SwitchDraft[]>([emptySwitch()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{
    deviceId: number;
    deviceKey: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const updateSwitch = (key: string, patch: Partial<SwitchDraft>) => {
    setSwitches((prev) =>
      prev.map((s) => (s.key === key ? { ...s, ...patch } : s)),
    );
  };

  const addSwitch = () => setSwitches((prev) => [...prev, emptySwitch()]);

  const removeSwitch = (key: string) =>
    setSwitches((prev) =>
      prev.length > 1 ? prev.filter((s) => s.key !== key) : prev,
    );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await createZone({
        deviceName,
        description,
        switches: switches.map((s, index) => ({
          switchNumber: index + 1,
          switchName: s.switchName,
          description: s.description,
          irCodeOn: s.irCodeOn,
          irCodeOff: s.irCodeOff,
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
    await navigator.clipboard.writeText(created.deviceKey);
    setCopied(true);
  };

  if (created) {
    return (
      <div className="flex items-center justify-center h-screen p-10">
        <div className="flex flex-col gap-6 w-full max-w-md p-8 border border-green-20 rounded-md bg-surface-10">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-xl font-sans">
              구역이 생성됐습니다
            </span>
            <span className="text-text-20 text-sm">
              아래 deviceKey는 다시 확인할 수 없으니 지금 ESP32에 저장해두세요.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-text-20 text-xs font-mono">
              deviceKey
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded-md border border-border-default bg-bg-default text-green-10 text-sm break-all">
                {created.deviceKey}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 rounded-md border border-border-default bg-surface-20 text-text-10 text-xs cursor-pointer hover:border-border-hover transition-colors"
              >
                {copied ? "복사됨" : "복사"}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-2 py-2 rounded-md bg-green-10 text-bg-default font-medium text-sm cursor-pointer transition-colors"
          >
            완료
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed top-0 flex items-center justify-between w-full px-10 py-5 border-b border-border-default bg-bg-default">
        <span className="font-bold font-sans">on & off</span>
      </div>

      <div className="flex flex-col pt-25 p-10 gap-8 max-w-2xl">
        <div className="flex items-center gap-4">
          <Link href="/">
            <BackButton />
          </Link>
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-semibold tracking-tight">
              구역 추가
            </span>
            <span className="text-sm text-text-20">
              구역과 스위치를 등록하면 발급된 deviceKey를 ESP32에 심어 바로
              연동할 수 있습니다.
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border-default bg-surface-10">
            <div className="flex flex-col gap-1.5">
              <label className="text-text-20 text-xs font-mono">
                구역 이름
              </label>
              <input
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                required
                placeholder="예: 사무실"
                className="px-3 py-2 rounded-md border border-border-default bg-bg-default text-text-10 text-sm outline-none focus:border-border-hover"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-text-20 text-xs font-mono">설명</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="예: 사무실 구역 조명 및 에어컨 제어"
                className="px-3 py-2 rounded-md border border-border-default bg-bg-default text-text-10 text-sm outline-none focus:border-border-hover"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-text-20">
                스위치 목록
              </span>
              <button
                type="button"
                onClick={addSwitch}
                className="text-xs font-mono text-green-10 hover:cursor-pointer"
              >
                + 스위치 추가
              </button>
            </div>

            {switches.map((s, index) => (
              <div
                key={s.key}
                className="flex flex-col gap-3 p-4 rounded-[14px] border border-border-default bg-surface-10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-text-30">
                    스위치 {index + 1}
                  </span>
                  {switches.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSwitch(s.key)}
                      className="text-xs font-mono text-text-30 hover:text-red-400 hover:cursor-pointer"
                    >
                      삭제
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-text-20 text-xs font-mono">
                      이름
                    </label>
                    <input
                      value={s.switchName}
                      onChange={(e) =>
                        updateSwitch(s.key, { switchName: e.target.value })
                      }
                      required
                      placeholder="예: 조명 1"
                      className="px-3 py-2 rounded-md border border-border-default bg-bg-default text-text-10 text-sm outline-none focus:border-border-hover"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-text-20 text-xs font-mono">
                      설명
                    </label>
                    <input
                      value={s.description}
                      onChange={(e) =>
                        updateSwitch(s.key, { description: e.target.value })
                      }
                      placeholder="예: 입구 쪽"
                      className="px-3 py-2 rounded-md border border-border-default bg-bg-default text-text-10 text-sm outline-none focus:border-border-hover"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-text-20 text-xs font-mono">
                      IR ON 코드
                    </label>
                    <input
                      value={s.irCodeOn}
                      onChange={(e) =>
                        updateSwitch(s.key, { irCodeOn: e.target.value })
                      }
                      required
                      placeholder="예: 0xFFA25D"
                      className="px-3 py-2 rounded-md border border-border-default bg-bg-default text-text-10 text-sm font-mono outline-none focus:border-border-hover"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-text-20 text-xs font-mono">
                      IR OFF 코드
                    </label>
                    <input
                      value={s.irCodeOff}
                      onChange={(e) =>
                        updateSwitch(s.key, { irCodeOff: e.target.value })
                      }
                      required
                      placeholder="예: 0xFFA857"
                      className="px-3 py-2 rounded-md border border-border-default bg-bg-default text-text-10 text-sm font-mono outline-none focus:border-border-hover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 rounded-md bg-green-10 text-bg-default font-medium text-sm cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "생성 중..." : "구역 생성"}
          </button>
        </form>
      </div>
    </div>
  );
}