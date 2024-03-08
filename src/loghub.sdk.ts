import { getProjectDetails, registerDevice } from './api';
import { LogHubError } from './errors';
import { Device, Project, RegisterDevice, Session } from './interfaces';
import { startSession, stopSession } from './plugins/session-manager.plugin';
import { getCPUInfo, getIPAddress, getMacAddress, getOSArchitecture, getOperatingSystemName, getOperatingSystemVersion, getRAMInfo } from './utils';
import { generateDeviceIdentifier } from './utils/indentifier.utils';

export class LogHub {
  private static instance: LogHub | null = null;
  readonly apiKey: string;
  readonly apiHost: string;
  readonly apiHeader: string;
  private readonly environment: string;
  private readonly version: string;
  private readonly enableScreenCapture: boolean;
  session?: Session;
  private project?: Project;
  device?: Device;
    instance: {};

  private constructor(
    apiKey: string,
    apiHost: string,
    enableScreenCapture: boolean = false,
    apiHeader: string = 'X-API-KEY',
    environment: string = 'unknown',
    version: string = 'unknown',
  ) {
    this.apiKey = apiKey;
    this.apiHost = apiHost;
    this.enableScreenCapture = enableScreenCapture;
    this.apiHeader = apiHeader;
    this.environment = environment;
    this.version = version;
  }

  private async handleSession() {
    if (!this.session) {
      // Start session if it hasn't been started yet
      await startSession(this);
  
      if (typeof window !== 'undefined') {
        // Browser environment
        // Listen for page unload event to stop the session
        window.addEventListener('beforeunload',async () => {
          await stopSession(this);
          this.session = undefined;
        });
      } else if (typeof process !== 'undefined') {
        // Node.js environment
        // Listen for process termination signals to stop the session
        process.on('SIGINT', this.handleShutdown);
        process.on('SIGTERM', this.handleShutdown);
      }
    }
  }

  private async handleShutdown(signal: string) {
    console.log(`LogHub Received ${signal}. Stopping session and shutting down gracefully...`);
  
    await stopSession(this);
    this.session = undefined;
  
    // Perform any additional cleanup tasks if necessary
  
    // Exit the application
    process.exit(0);
  }
  

  public static async init(
    options: {
      apiKey: string;
      apiHost: string;
    },
    extra?: {
      enableScreenCapture?: boolean;
      apiHeader?: string;
      environment?: string;
      version?: string;
    },
  ): Promise<LogHub> {
    if (!LogHub.instance) {
      LogHub.instance = new LogHub(
        options.apiKey,
        options.apiHost,
        extra?.enableScreenCapture,
        extra?.apiHeader,
        extra?.environment,
        extra?.version,
      );
    }
    await LogHub.fetchProjectDetails();
    return LogHub.instance;
  }

  private static async fetchProjectDetails() {
    const { apiHost, apiKey, apiHeader } = LogHub.instance;
    const result = await getProjectDetails(apiHost, apiKey, apiHeader);
    if (result.status == 200) {
      LogHub.instance.project = result.data;
      const { environment, version, project } = LogHub.instance;
      //Register Device
      if (environment !== 'unknown') {
        if (!project.environments.some((value) => value == environment)) {
          throw new LogHubError(
            'Unrecognized environment; Please Create it on CMS',
          );
        }
      }

      if (version !== 'unkown') {
        if (!project.releases.some((release) => release.version == version)) {
          throw new LogHubError(
            'Unrecognized version; Please Create new project release on CMS',
          );
        }
      }

      await LogHub.registerNewDevice(apiHost, apiKey, apiHeader);
    } else {
      throw new LogHubError('Failed to featch project details');
    }
  }

  private static async registerNewDevice(
    apiHost: string,
    apiKey: string,
    apiHeader: string,
  ) {
    const {environment, project, version} = LogHub.instance;
    const releaseId = project.releases.find((value) => value.version == version)?.releaseId
    const dto: RegisterDevice = {
      uniqueIdentifier: generateDeviceIdentifier(),
      os: getOperatingSystemName(),
      osVersion: getOperatingSystemVersion(),
      environment: environment,
      ipAddress: await getIPAddress(),
      cpuInfo: getCPUInfo(),
      macAddress: getMacAddress(),
      maxRam: getRAMInfo(),
      architecture: getOSArchitecture(),
      releaseId: releaseId ?? 'unknown',
    };
    const deviceResult = await registerDevice(apiHost, apiKey, apiHeader, dto);
    if (deviceResult.status == 200 || deviceResult.status == 201) {
      LogHub.instance.device = deviceResult.data;
      await LogHub.instance.handleSession();
    } else {
      throw new LogHubError('Failed to register new Deivce');
    }
  }
}
