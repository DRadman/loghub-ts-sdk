import { CPUInfo } from "./cpu-info.interface";

export interface RegisterDevice {
  uniqueIdentifier: string;
  os: string;
  osVersion: string;
  environment: string;
  ipAddress: string;
  cpuInfo: CPUInfo;
  macAddress: string;
  maxRam: number;
  architecture: string;
  releaseId: string;
}
