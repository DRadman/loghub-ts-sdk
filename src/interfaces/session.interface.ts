export interface Session {
  sessionId?: string;
  startTime: Date;
  endTime: Date;
  networkType: string;
  networkSpeed: string;
  crashFree: boolean;
}
