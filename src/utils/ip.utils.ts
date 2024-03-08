export async function getIPAddress(): Promise<string> {
  if (typeof window !== 'undefined') {
    // Browser environment
    return new Promise((resolve, reject) => {
      const rtcPeerConnection = new RTCPeerConnection({ iceServers: [] });
      rtcPeerConnection.createDataChannel('');
      rtcPeerConnection
        .createOffer()
        .then((offer) => rtcPeerConnection.setLocalDescription(offer))
        .catch(reject);
      rtcPeerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          const regex = /(\d+\.\d+\.\d+\.\d+)/;
          const match = regex.exec(event.candidate.candidate);
          if (match) {
            resolve(match[0]);
          } else {
            resolve('unknown');
          }
        }
      };
    });
  } else if (typeof process !== 'undefined') {
    // Node.js environment
    const interfaces = require('os').networkInterfaces();
    for (const ifaceName of Object.keys(interfaces)) {
      const iface = interfaces[ifaceName];
      for (const { address, family, internal } of iface) {
        if (family === 'IPv4' && !internal) {
          return address;
        }
      }
    }
    return 'unknown';
  } else {
    // Unknown environment
    return 'unknown';
  }
}

export function getMacAddress() {
  if (typeof window !== 'undefined') {
    return 'unknown';
  } else if (typeof process !== 'undefined') {
    const networkInterfaces = require('os').networkInterfaces();
    for (const ifaceName of Object.keys(networkInterfaces)) {
      const iface = networkInterfaces[ifaceName];
      for (const { address, mac } of iface) {
        if (
          !mac ||
          mac === '00:00:00:00:00:00' ||
          mac === 'ff:ff:ff:ff:ff:ff'
        ) {
          continue; // Skip invalid MAC addresses
        }
        return mac;
      }
    }
    return 'unknown';
  }
}
