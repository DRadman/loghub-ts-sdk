import { startApiSession, updateApiSession } from '../api';
import { LogHubError } from '../errors';
import { LogHub } from '../loghub.sdk';

export async function startSession(instance: LogHub) {
  const FastSpeedtest = require('fast-speedtest-api');

  const speedtest = new FastSpeedtest({
    token: 'YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm', // required
    unit: FastSpeedtest.UNITS.Mbps, // default: Bps
  });

  instance.session = {
    crashFree: true,
    endTime: null,
    startTime: new Date(),
    networkSpeed: 'unknown',
    networkType: 'http',
  };

  await Promise.all(
    speedtest
      .getSpeed()
      .then(async (s) => {
        if (instance.session) {
          instance.session.networkSpeed = `${s}`;
          const { apiHost, apiKey, apiHeader, device } = instance;
          const result = await startApiSession(
            apiHost,
            apiKey,
            apiHeader,
            device.logSourceId,
            instance.session,
          );
          if (result.status == 200 || result.status == 201) {
            instance.session = result.data;
          }
        } else {
          throw new LogHubError('Failed to initialized session');
        }
      })
      .catch(async () => {
        const { apiHost, apiKey, apiHeader, device } = instance;
        const result = await startApiSession(
          apiHost,
          apiKey,
          apiHeader,
          device.logSourceId,
          instance.session,
        );
        if (result.status == 200 || result.status == 201) {
          instance.session = result.data;
        } else {
          throw new LogHubError('Failed to initialized session');
        }
      }),
  );
}

export async function stopSession(instance: LogHub) {
  const { apiHost, apiKey, apiHeader, device } = instance;
  instance.session.endTime = new Date();
  const result = await updateApiSession(
    apiHost,
    apiKey,
    apiHeader,
    device.logSourceId,
    instance.session,
  );
  if (result.status == 200 || result.status == 201) {
    instance.session = result.data;
  } else {
    throw new LogHubError('Failed to stop session');
  }
}
