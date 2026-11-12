# on & off

적외선(IR) 스위치를 구역 단위로 묶어 웹 브라우저에서 켜고 끄는 관리자용 통합 제어 대시보드입니다.  
백엔드 REST API와 연동되어 있으며, 관리자 로그인 이후에만 대시보드에 접근할 수 있습니다.

---

## 주요 기능

- **로그인 인증** — 관리자 계정으로 로그인해야 대시보드에 접근 가능 (JWT httpOnly 쿠키 기반)
- **구역 대시보드** — 등록된 모든 구역과 활성/비활성/부분 상태, 총 구역·총 스위치·활성 스위치 수를 한눈에 파악
- **장치 개별/일괄 제어** — 구역 상세 페이지에서 스위치를 하나씩 토글하거나 구역 전체를 한 번에 켜고 끄기
- **구역 생성/삭제** — 구역과 스위치(IR ON/OFF 코드 포함)를 등록하면 ESP32에 심을 `deviceKey`가 발급됨. 불필요한 구역은 삭제 가능
- **레이아웃 전환** — 구역 상세 화면을 가로/세로 카드 형태로 선택 가능
- **API 연결 상태 표시** — 백엔드와의 통신 상태(연결 중/정상/끊김/오류)를 상단 배지로 표시
- **상태 자동 동기화** — 실시간 push 채널이 없어 15초 간격 폴링으로 최신 상태를 반영 (제어 시에는 낙관적 업데이트 후 명령 완료 여부 확인)

---

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| 언어 | TypeScript |
| UI | React 19, Tailwind CSS 4 |
| 통신 | REST API (`fetch`, `credentials: "include"`) |
| 인증 | 백엔드 발급 JWT httpOnly 쿠키 |

---

## 아키텍처 개요

프론트와 백엔드가 서로 다른 origin이라, 쿠키가 cross-site 취급되어 로그인 세션이 유지되지 않는 문제가 있습니다. 이를 same-origin처럼 보이게 만들어 해결했습니다.

- **`next.config.ts`** — `/api/v1/*` 요청을 `next dev`/`next start` 서버가 `BACKEND_ORIGIN`으로 그대로 중계(rewrite)합니다. 브라우저 입장에서는 모든 요청이 프론트와 같은 origin이라 쿠키가 정상적으로 실립니다.
- **`src/proxy.ts`** — Next.js 16의 Proxy(구 Middleware)로, 로그인 페이지를 제외한 모든 라우트 진입 시 `GET /auth/me`를 백엔드에 그대로 위임해 로그인 여부를 확인합니다. 미로그인이면 `/login`으로 리다이렉트합니다. (쿠키 이름/만료 정책이 명세에 없어 쿠키 존재 여부 대신 이 방식을 사용합니다.)
- **`src/context/DeviceContext.tsx`** — 구역/장치 목록을 15초 간격으로 폴링하고, 제어 시에는 낙관적으로 화면을 먼저 갱신한 뒤 `GET /commands/:id`로 명령 완료 여부를 확인합니다.
- **`src/lib/api.ts`** — 모든 API 요청에 쓰이는 공용 `fetch` 래퍼. 백엔드의 `{ status: "SUCCESS" | "ERROR" }` 응답 포맷을 해석하고, `401 UNAUTHORIZED` 응답을 받으면 자동으로 로그인 페이지로 이동시킵니다.

---

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (폰트, 전역 스타일)
│   ├── login/page.tsx          # 로그인 페이지 (/login)
│   └── (main)/                 # 로그인 필요 라우트 그룹
│       ├── layout.tsx          # DeviceProvider 주입
│       ├── page.tsx            # 구역 대시보드 (/)
│       ├── [id]/page.tsx       # 구역 상세 제어 (/[id])
│       └── new/page.tsx        # 구역 생성 (/new)
├── proxy.ts                    # 로그인 여부에 따른 라우트 보호
├── features/
│   ├── auth/ui/                # 로그인 뷰
│   ├── main/ui/                # 대시보드 뷰
│   ├── control/ui/             # 장치 제어 뷰 (가로/세로 레이아웃)
│   └── zone/ui/                # 구역 생성 뷰
├── components/                 # 공통 UI 컴포넌트 (뱃지/버튼/카드/스위치 등)
├── context/
│   └── DeviceContext.tsx       # 구역/장치 상태 폴링 및 제어 로직 전역 관리
├── entities/
│   ├── auth/                   # 로그인/로그아웃 API, 타입
│   ├── zone/                   # 구역 조회/생성/삭제 API, 타입
│   ├── control/                # 스위치 제어 API
│   ├── device/                 # 백엔드 DTO, 구역 생성 입력 타입
│   └── status/                 # 공용 상태(on/off/partial) 타입
└── lib/
    └── api.ts                  # 공용 fetch 래퍼 (에러 처리, 401 리다이렉트)
```

---

## 시작하기

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하세요.

```env
# 서버(Next.js) 전용 — next.config.ts rewrite와 proxy.ts가 서버 간 통신에 사용
BACKEND_ORIGIN=http://localhost:8080

# 브라우저가 실제로 호출하는 주소. 프론트와 같은 origin의 상대 경로로 둬야
# 백엔드 로그인 쿠키가 cross-site 취급되지 않는다 (next.config.ts rewrite가 중계).
NEXT_PUBLIC_API_URL=/api/v1

# true면 백엔드 없이 목데이터로 동작 (기본 false)
NEXT_PUBLIC_USE_MOCK=false

# 제어 명령 완료 확인 간격 / 최대 대기 시간 (ms, 비워두면 1000 / 5000)
NEXT_PUBLIC_COMMAND_POLL_INTERVAL_MS=
NEXT_PUBLIC_COMMAND_TIMEOUT_MS=
```

### 목데이터 모드

백엔드에 연결할 수 없을 때는 `NEXT_PUBLIC_USE_MOCK=true`로 실행하세요.

- 모든 API 호출이 [`src/lib/mock.ts`](./src/lib/mock.ts)의 가짜 서버로 처리됩니다 (구역 4개, 스위치 12개 시드 데이터).
- 로그인은 아이디·비밀번호에 아무 값이나 입력하면 되고, 상단에 `목데이터` 배지가 표시됩니다.
- 변경한 상태는 브라우저 localStorage(`on-off:mock-db`)에 저장됩니다. 초기화하려면 해당 키를 지우세요.
- `NEXT_PUBLIC_*` 값은 빌드 시점에 반영되므로, 값을 바꾼 뒤에는 개발 서버를 재시작하거나 다시 빌드해야 합니다.

### 배포 시 주의

- 배포 환경에는 **빌드 전에** `BACKEND_ORIGIN`과 `NEXT_PUBLIC_USE_MOCK=false`를 설정하세요. `/api/v1/*` 중계(rewrite) 주소와 목데이터 여부가 빌드 결과물에 고정됩니다.
- `NEXT_PUBLIC_USE_MOCK`을 아예 설정하지 않으면 `false`로 동작합니다 (실제 백엔드 연동).
- `.env.local`은 git에 올라가지 않으므로, 배포 서버에는 [`.env.example`](./.env.example)을 참고해 따로 설정해야 합니다.

### 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 으로 접속하면 로그인 페이지로 이동합니다. 로컬 개발용 관리자 계정은 백엔드 시드 기준 `admin` / `admin1234` 입니다.

---

## 백엔드 API 연동

프론트가 호출하는 엔드포인트는 다음과 같습니다. 요청/응답 상세 명세는 [`api.md`](./api.md)를 참고하세요.

| 기능 | 엔드포인트 |
|------|-----------|
| 로그인 / 로그아웃 / 로그인 확인 | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` |
| 구역 목록 조회 | `GET /devices` |
| 구역 생성 / 삭제 | `POST /devices`, `DELETE /devices/:deviceId` |
| 스위치 개별 / 일괄 제어 | `POST /control/light`, `POST /control/light/all` |
| 명령 완료 여부 확인 | `GET /commands/:commandId` |

모든 요청은 `credentials: "include"`로 JWT 쿠키를 함께 전송하며, 백엔드는 `{ status: "SUCCESS", data }` / `{ status: "ERROR", error }` 형태로 응답합니다.

---

## 알려진 제약 및 앞으로의 방향

- **실시간 동기화 부재** — WebSocket/SSE 없이 15초 폴링만 지원되어, 다른 관리자나 물리 스위치 조작이 화면에 즉시 반영되지 않습니다.
- **쿠키 정책 불확실** — 쿠키 이름·만료 시간이 명세에 없어 `proxy.ts`가 페이지 이동마다 `GET /auth/me`를 호출합니다. 쿠키 스펙이 확정되면 존재 여부만으로 1차 판단하도록 최적화할 수 있습니다.
- **구역 수정 미구현** — 백엔드는 `PATCH /devices/:deviceId`를 제공하지만 프론트에는 아직 수정 화면이 없습니다.
- **모바일 대응** — 현재 레이아웃은 데스크톱 기준입니다. 반응형 레이아웃 적용을 고려할 수 있습니다.

백엔드 연동 과정에서 명세만으로 확정하지 못해 임시로 가정하고 구현한 부분은 [`api.md`](./api.md) 하단 "프론트 구현 중 확인이 필요한 사항"에 정리되어 있습니다.
