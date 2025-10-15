/**
 * QR Code Utility Functions
 * Handles encoding and decoding of QR code data for event attendance
 */

export interface QRCodeData {
  eventId: string;
  timestamp: number;
}

/**
 * Encodes event data into a base64 string for QR code generation
 * @param eventId - The event ID
 * @param timestamp - The timestamp (defaults to current time)
 * @returns Base64 encoded string
 */
export function encodeQRData(eventId: string, timestamp?: number): string {
  const data: QRCodeData = {
    eventId,
    timestamp: timestamp || Date.now(),
  };

  const jsonString = JSON.stringify(data);

  // Use btoa for base64 encoding (browser API)
  return btoa(jsonString);
}

/**
 * Decodes a base64 QR code string back to event data
 * @param qrString - The base64 encoded QR string
 * @returns Decoded QR code data
 * @throws Error if decoding or parsing fails
 */
export function decodeQRData(qrString: string): QRCodeData {
  try {
    // Use atob for base64 decoding (browser API)
    const jsonString = atob(qrString);
    const data = JSON.parse(jsonString) as QRCodeData;

    // Validate the decoded data
    if (!data.eventId || typeof data.timestamp !== 'number') {
      throw new Error('Invalid QR code data structure');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to decode QR code: ${error.message}`);
    }
    throw new Error('Failed to decode QR code: Unknown error');
  }
}

/**
 * Validates if a string is a valid base64 encoded QR code
 * @param qrString - The string to validate
 * @returns true if valid, false otherwise
 */
export function isValidQRCode(qrString: string): boolean {
  try {
    decodeQRData(qrString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets a human-readable timestamp from a QR code
 * @param timestamp - The timestamp from QR code data
 * @returns Formatted date string
 */
export function formatQRTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
