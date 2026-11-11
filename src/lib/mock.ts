// NEXT_PUBLIC_USE_MOCK=true 일 때 apiFetch가 백엔드 대신 호출하는 가짜 서버.
// 실제 API와 같은 경로·응답 모양을 흉내 내며, 상태는 localStorage에 저장돼 새로고침해도 유지된다.
import type {
  CreateDeviceInput,
  DeviceDTO,
} from "@/entities/device/type";

type CommandState = "PENDING" | "DONE" | "TIMEOUT";

interface MockDb {
  loggedIn: boolean;
  nextDeviceId: number;
  nextCommandId: number;
  devices: DeviceDTO[];
  commands: Record<number, { doneAt: number }>;
}

export class MockError extends Error {
  constructor(
    public httpStatus: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

const STORAGE_KEY = "on-off:mock-db";
const LATENCY_MS = 250;
const COMMAND_DELAY_MS = 700;

const sw = (
  switchNumber: number,
  switchName: string,
  description: string,
  isOn: boolean,
) => ({ switchNumber, switchName, description, isOn });

function seed(): MockDb {
  return {
    loggedIn: false,
    nextDeviceId: 5,
    nextCommandId: 1,
    commands: {},
    devices: [
      {
        deviceId: 1,
        deviceName: "1층 사무실",
        description: "사무실 천장 조명과 에어컨",
        switches: [
          sw(1, "천장 조명 A", "입구 쪽", true),
          sw(2, "천장 조명 B", "창가 쪽", true),
          sw(3, "에어컨", "벽걸이형", true),
        ],
      },
      {
        deviceId: 2,
        deviceName: "회의실",
        description: "대회의실 조명 및 프로젝터",
        switches: [
          sw(1, "메인 조명", "회의 테이블 위", true),
          sw(2, "보조 조명", "벽면 간접등", false),
          sw(3, "프로젝터", "천장 거치형", false),
        ],
      },
      {
        deviceId: 3,
        deviceName: "휴게실",
        description: "휴게 공간 조명",
        switches: [
          sw(1, "조명", "전체 조명", false),
          sw(2, "커피머신", "콘센트 제어", false),
        ],
      },
      {
        deviceId: 4,
        deviceName: "복도",
        description: "1층 복도 센서등",
        switches: [
          sw(1, "복도 조명 1", "계단 쪽", true),
          sw(2, "복도 조명 2", "엘리베이터 쪽", false),
          sw(3, "비상등", "출구 표시", true),
          sw(4, "외부 조명", "현관 앞", false),
        ],
      },
    ],
  };
}

let memory: MockDb | null = null;

function load(): MockDb {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    memory = raw ? (JSON.parse(raw) as MockDb) : seed();
  } catch {
    memory = seed();
  }
  return memory;
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    // 시크릿 모드 등에서 저장이 막혀도 메모리 상태로 계속 동작한다.
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function requireAuth(db: MockDb) {
  if (!db.loggedIn) {
    throw new MockError(401, "UNAUTHORIZED", "로그인이 필요합니다.");
  }
}

function findDevice(db: MockDb, deviceId: number) {
  const device = db.devices.find((d) => d.deviceId === deviceId);
  if (!device) {
    throw new MockError(404, "NOT_FOUND", "존재하지 않는 구역입니다.");
  }
  return device;
}

function issueCommand(db: MockDb) {
  const id = db.nextCommandId++;
  db.commands[id] = { doneAt: Date.now() + COMMAND_DELAY_MS };
  return id;
}

export async function mockFetch(path: string, init?: RequestInit) {
  await sleep(LATENCY_MS);
  const db = load();
  const method = (init?.method ?? "GET").toUpperCase();
  const body = init?.body ? JSON.parse(String(init.body)) : {};
  const route = `${method} ${path.split("?")[0]}`;

  try {
    if (route === "POST /auth/login") {
      if (!body.username || !body.password) {
        throw new MockError(401, "UNAUTHORIZED", "아이디 또는 비밀번호 오류");
      }
      db.loggedIn = true;
      return { user: { id: 1, username: body.username } };
    }
    if (route === "POST /auth/logout") {
      db.loggedIn = false;
      return undefined;
    }
    if (route === "GET /auth/me") {
      requireAuth(db);
      return { user: { id: 1, username: "admin" } };
    }

    requireAuth(db);

    if (route === "GET /devices") {
      return structuredClone(db.devices);
    }
    if (route === "POST /devices") {
      const input = body as CreateDeviceInput;
      const deviceId = db.nextDeviceId++;
      db.devices.push({
        deviceId,
        deviceName: input.deviceName,
        description: input.description,
        switches: input.switches.map((s) => ({
          switchNumber: s.switchNumber,
          switchName: s.switchName,
          description: s.description,
          isOn: false,
        })),
      });
      const deviceKey = `mock-${crypto.getRandomValues(new Uint32Array(2)).join("")}`;
      return { deviceId, deviceKey };
    }

    const deleteMatch = route.match(/^DELETE \/devices\/(\d+)$/);
    if (deleteMatch) {
      const id = Number(deleteMatch[1]);
      findDevice(db, id);
      db.devices = db.devices.filter((d) => d.deviceId !== id);
      return undefined;
    }

    if (route === "POST /control/light") {
      const device = findDevice(db, body.deviceId);
      const target = device.switches.find(
        (s) => s.switchNumber === body.switchNumber,
      );
      if (!target) {
        throw new MockError(404, "NOT_FOUND", "존재하지 않는 스위치입니다.");
      }
      target.isOn = body.action === "ON";
      return { commandId: issueCommand(db) };
    }
    if (route === "POST /control/light/all") {
      const device = findDevice(db, body.deviceId);
      const commandIds = device.switches.map((s) => {
        s.isOn = body.action === "ON";
        return issueCommand(db);
      });
      return { commandIds };
    }

    const commandMatch = route.match(/^GET \/commands\/(\d+)$/);
    if (commandMatch) {
      const commandId = Number(commandMatch[1]);
      const command = db.commands[commandId];
      if (!command) {
        throw new MockError(404, "NOT_FOUND", "존재하지 않는 명령입니다.");
      }
      const state: CommandState =
        Date.now() >= command.doneAt ? "DONE" : "PENDING";
      return { commandId, state };
    }

    throw new MockError(404, "NOT_FOUND", `목 API에 없는 경로: ${route}`);
  } finally {
    save();
  }
}
