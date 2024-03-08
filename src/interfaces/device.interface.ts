import { CPUInfo } from "./cpu-info.interface";
import { ProjectRelease } from "./project-release.interface";

export interface Device {
  logSourceId: string;
  uniqueIdentifier: string;
  os: string;
  osVersion: string;
  environment: string;
  ipAddress: string;
  cpuInfo: CPUInfo;
  macAddress: string;
  maxRam: number;
  architecture: string;
  createdAt: Date;
  updatedAt: Date;
  release?: ProjectRelease;
}
