function generateStableIdentifier(): string {
  let combinedInfo: string = '';

  if (typeof window !== 'undefined') {
    // Browser environment
    combinedInfo += navigator.userAgent || '';
    // Additional browser-specific information if available
  } else if (typeof process !== 'undefined') {
    // Node.js environment
    const networkInterfaces = require('os').networkInterfaces();
    for (const ifaceName of Object.keys(networkInterfaces)) {
      const iface = networkInterfaces[ifaceName];
      for (const { address } of iface) {
        combinedInfo += address || '';
      }
    }
    // Additional Node.js-specific information if available
  }

  // Add a randomly generated UUID as a fallback
  combinedInfo += generateRandomUUID();

  // Hash the combined information
  const identifier = hash(combinedInfo);

  return identifier;
}

function generateRandomUUID(): string {
  // Generate a random UUID
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    },
  );
  return uuid;
}

function hash(input: string): string {
  // Implement your preferred hashing algorithm (e.g., SHA-256)
  // For simplicity, let's assume it's a basic hash function
  let hash = 0;
  if (input.length === 0) return hash.toString();
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

export function generateDeviceIdentifier(): string {
  let identifier = '';

  // Check if local storage is available (for browser)
  if (typeof window !== 'undefined' && window.localStorage) {
    // Attempt to retrieve the identifier from local storage
    identifier = window.localStorage.getItem('deviceIdentifier') || '';
  } else if (typeof process !== 'undefined') {
    // Node.js environment
    try {
      // Attempt to read the identifier from the file
      const identifierFilePath = require('path').join(
        __dirname,
        'deviceIdentifier.txt',
      );
      identifier = require('fs')
        .readFileSync(identifierFilePath, 'utf8')
        .trim();
    } catch (err) {
      // If the file doesn't exist or cannot be read, generate a new identifier
      identifier = generateStableIdentifier();
      // Store the newly generated identifier
      storeIdentifier(identifier);
    }
  }

  // If no identifier exists, generate a new one
  if (!identifier) {
    identifier = generateStableIdentifier();
    // Store the generated identifier for future use
    storeIdentifier(identifier);
  }

  return identifier;
}

function storeIdentifier(identifier: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Store the identifier in local storage (for browser)
    window.localStorage.setItem('deviceIdentifier', identifier);
  } else if (typeof process !== 'undefined') {
    // Node.js environment
    try {
      // Write the identifier to the file
      const identifierFilePath = require('path').join(
        __dirname,
        'deviceIdentifier.txt',
      );
      require('fs').writeFileSync(identifierFilePath, identifier, 'utf8');
    } catch (err) {
      // Handle file write errors
      console.error('Error storing device identifier:', err);
    }
  }
}
