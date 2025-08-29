import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a 4-digit numeric code
 */
export const generateCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Generate a unique filename with timestamp and UUID
 */
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const uuid = uuidv4().substring(0, 8);
  const extension = originalName.substring(originalName.lastIndexOf('.'));
  const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
  
  return `${timestamp}_${uuid}_${baseName}${extension}`;
};

/**
 * Validate file size (max 2GB)
 */
export const validateFileSize = (size: number): boolean => {
  const MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2GB in bytes
  return size <= MAX_SIZE;
};

/**
 * Validate file type (basic security check)
 */
export const validateFileType = (mimetype: string): boolean => {
  // Blocked dangerous file types
  const blockedTypes = [
    'application/x-executable',
    'application/x-msdownload',
    'application/x-msdos-program'
  ];
  
  return !blockedTypes.includes(mimetype);
};

/**
 * Calculate expiry date
 */
export const calculateExpiryDate = (hours: number = 24): Date => {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
};

/**
 * Check if code is expired
 */
export const isExpired = (expiryDate: Date): boolean => {
  return new Date() > expiryDate;
};
