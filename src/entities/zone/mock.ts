import { BinaryStatus } from "@/entities/status/type";

interface DeviceStatusProps {
  id: number;
  status: BinaryStatus;
  title: string;
  description: string;
}

export interface ZONESProps {
  id: number;
  title: string;
  description: string;
  deviceStatus: DeviceStatusProps[];
}

export const ZONES: ZONESProps[] = [
  {
    id: 1,
    title: "3층 홈베이스",
    description: "3층 홈베이스 스위치 제어",
    deviceStatus: [
      {
        id: 1,
        status: "on",
        title: "첫번째 스위치",
        description: "오른쪽 안쪽",
      },
      {
        id: 2,
        status: "off",
        title: "두번째 스위치",
        description: "왼쪽 안쪽",
      },
      {
        id: 3,
        status: "off",
        title: "세번째 스위치",
        description: "가운데 부분",
      },
    ],
  },
  {
    id: 2,
    title: "창고 동",
    description: "재고 관리 구역 보안등 및 환기 제어",
    deviceStatus: [
      {
        id: 1,
        status: "off",
        title: "보안 조명",
        description: "외부 보안등 회로",
      },
      {
        id: 2,
        status: "off",
        title: "환기 시스템",
        description: "창고 내부 공기 순환",
      },
      {
        id: 3,
        status: "off",
        title: "셔터 제어",
        description: "자동 도어 시스템",
      },
    ],
  },
  {
    id: 3,
    title: "사무실",
    description: "사무실 구역 조명 및 에어컨 제어",
    deviceStatus: [
      {
        id: 1,
        status: "on",
        title: "조명 시스템",
        description: "전체 조명 회로 제어",
      },
      {
        id: 2,
        status: "off",
        title: "공조 장치",
        description: "냉난방 통합 제어",
      },
      { id: 3, status: "on", title: "오디오", description: "회의실 음향 장치" },
      {
        id: 4,
        status: "off",
        title: "빔 프로젝터",
        description: "회의실 전원 제어",
      },
    ],
  },
  {
    id: 4,
    title: "생산 라인",
    description: "생산 라인 구역 기계 및 안전 시스템 제어",
    deviceStatus: [
      {
        id: 1,
        status: "on",
        title: "보조 발전기",
        description: "비상 전원 공급 장치",
      },
      {
        id: 2,
        status: "on",
        title: "배기 팬",
        description: "환기 시스템 제어",
      },
    ],
  },
];
