import { CPUInfo } from '../interfaces';

export function getOperatingSystemName(): string {
  if (typeof window !== 'undefined') {
    // Browser environment
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf('windows') !== -1) {
      return 'Windows';
    } else if (userAgent.indexOf('mac') !== -1) {
      return 'macOS';
    } else if (userAgent.indexOf('linux') !== -1) {
      return 'Linux';
    } else if (userAgent.indexOf('android') !== -1) {
      return 'Android';
    } else if (userAgent.indexOf('ios') !== -1) {
      return 'iOS';
    } else {
      return 'unknown';
    }
  } else if (typeof process !== 'undefined') {
    // Node.js environment
    const os = require('os');
    return os.platform();
  } else {
    // Unknown environment
    return 'unknown';
  }
}

export function getOperatingSystemVersion(): string {
  if (typeof window !== 'undefined') {
    // Browser environment
    const userAgent = navigator.userAgent.toLowerCase();
    let osVersion = 'unknown';

    if (userAgent.indexOf('windows') !== -1) {
      const match = /windows nt (\d+\.\d+)/.exec(userAgent);
      if (match) {
        osVersion = match[1];
      }
    } else if (userAgent.indexOf('mac') !== -1) {
      const match = /mac os x (\d+([._]\d+)*)/.exec(userAgent);
      if (match) {
        osVersion = match[1].replace(/_/g, '.');
      }
    } else if (userAgent.indexOf('linux') !== -1) {
      const match = /linux/.exec(userAgent);
      if (match) {
        osVersion = 'Linux';
      }
    } else if (userAgent.indexOf('android') !== -1) {
      const match = /android (\d+(\.\d+)*)/.exec(userAgent);
      if (match) {
        osVersion = match[1];
      }
    } else if (userAgent.indexOf('ios') !== -1) {
      const match = /cpu(?: iphone)? os (\d+_\d+)/.exec(userAgent);
      if (match) {
        osVersion = match[1].replace(/_/g, '.');
      }
    }

    return osVersion;
  } else {
    if (typeof process !== 'undefined') {
      // Node.JS environment
      const os = require('os');
      return os.release();
    } else {
      //Unknown environment
      return 'unknown';
    }
  }
}

export function getOSArchitecture(): string {
  if (typeof window !== 'undefined') {
    // Browser environment
    const userAgent = navigator.userAgent.toLowerCase();

    // Check if the browser is running on a 64-bit architecture
    if (
      userAgent.indexOf('win64') !== -1 ||
      userAgent.indexOf('wow64') !== -1
    ) {
      return 'x64';
    } else if (userAgent.indexOf('arm64') !== -1) {
      return 'arm64';
    } else {
      return 'x86'; // Assuming 32-bit architecture by default for browsers
    }
  } else if (typeof process !== 'undefined') {
    // Node.js environment
    return process.arch;
  } else {
    // Unknown environment
    return 'unknown';
  }
}

export function getRAMInfo(): number {
  if (
    typeof window !== 'undefined' &&
    navigator &&
    'deviceMemory' in navigator
  ) {
    // Browser environment and deviceMemory is available
    const deviceMemory = navigator.deviceMemory as number;
    return deviceMemory * 1024 * 1024 * 1024; // Convert from GB to bytes
  } else if (typeof process !== 'undefined') {
    // Node.js environment
    const os = require('os');
    return os.totalmem(); // Returns total system memory in bytes
  } else {
    // Unknown environment or unable to determine RAM info
    return 0;
  }
}

export function getCPUInfo(): CPUInfo {
  if (
    typeof window !== 'undefined' &&
    navigator &&
    'hardwareConcurrency' in navigator
  ) {
    // Browser environment
    return {
      model: 'unknown',
      cores: navigator.hardwareConcurrency || 0,
      speed: 0,
      threads: 0, // Cannot determine number of threads in browser
    };
  } else if (typeof process !== 'undefined') {
    // Node.js environment
    const os = require('os');
    const cpus = os.cpus();
    const totalCores = cpus.length;
    let totalThreads = 0;
    cpus.forEach((cpu) => {
      totalThreads +=
        cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle;
    });
    return {
      model: totalCores > 0 ? cpus[0].model || 'unknown' : 'unknown',
      cores: totalCores,
      speed: cpus.length > 0 ? cpus[0].speed || 0 : 0,
      threads: totalThreads,
    };
  } else {
    // Unknown environment or unable to determine CPU info
    return {
      model: 'unkown',
      cores: 0,
      speed: 0,
      threads: 0,
    };
  }
}
