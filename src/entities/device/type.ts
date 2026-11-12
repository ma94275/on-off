export interface SwitchDTO {
  switchNumber: number;
  switchName: string;
  description: string;
  isOn: boolean;
}

export interface DeviceDTO {
  deviceId: number;
  deviceName: string;
  description: string;
  switches: SwitchDTO[];
}

export interface CreateSwitchInput {
  switchNumber: number;
  switchName: string;
  description: string;
  irCodeOn: string;
  irCodeOff: string;
}

export interface CreateDeviceInput {
  deviceName: string;
  description: string;
  switches: CreateSwitchInput[];
}

export interface CreateDeviceResult {
  deviceId: number;
  deviceKey: string;
}
