import axios, { AxiosHeaders, AxiosResponse } from 'axios';
import { Device, RegisterDevice, Session } from '../interfaces';

export function registerDevice(
  apiHost: string,
  apiKey: string,
  apiHeader: string,
  dto: RegisterDevice,
): Promise<AxiosResponse<Device>> {
  const headers = new AxiosHeaders();
  headers.set('Content-Type', 'application/json');
  headers.set(apiHeader, apiKey);
  return axios.get<Device>(apiHost + '/api/v1/device/register', {
    headers: headers,
  });
}

export function startApiSession(
  apiHost: string,
  apiKey: string,
  apiHeader: string,
  deviceId: string,
  dto: {
    startTime: Date;
    networkType: string;
    networkSpeed: string;
    crashFree?: boolean;
    endTime?: Date;
  },
): Promise<AxiosResponse<Session>> {
  const headers = new AxiosHeaders();
  headers.set('Content-Type', 'application/json');
  headers.set(apiHeader, apiKey);
  return axios.post<Session>(
    apiHost + '/api/v1/device/start-session/' + deviceId,
    dto,
    {
      headers: headers,
    },
  );
}

export function updateApiSession(
    apiHost: string,
    apiKey: string,
    apiHeader: string,
    sessionId: string,
    dto: {
      startTime: Date;
      networkType: string;
      networkSpeed: string;
      crashFree?: boolean;
      endTime?: Date;
    },
  ): Promise<AxiosResponse<Session>> {
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set(apiHeader, apiKey);
    return axios.post<Session>(
      apiHost + '/api/v1/device/update-session/' + sessionId,
      dto,
      {
        headers: headers,
      },
    );
  }
