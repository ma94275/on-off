import { BinaryStatus } from "@/entities/status/type";

export interface DeviceStatusProps {
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
