// Format file size to human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Format date to relative time
export const formatTimeRemaining = (expiresAt: string): string => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  
  if (diff <= 0) {
    return 'Expired';
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else {
    return `${minutes}m remaining`;
  }
};

// Validate file size (max 2GB)
export const validateFileSize = (file: File): boolean => {
  const MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
  return file.size <= MAX_SIZE;
};

// Validate file type (basic check)
export const validateFileType = (file: File): boolean => {
  // Block potentially dangerous file types
  const blockedExtensions = ['.exe', '.bat', '.cmd', '.scr', '.msi'];
  const fileName = file.name.toLowerCase();
  
  return !blockedExtensions.some(ext => fileName.endsWith(ext));
};

// Generate error message for file validation
export const getFileValidationError = (file: File): string | null => {
  if (!validateFileSize(file)) {
    return `${file.name} exceeds 2GB limit`;
  }
  
  if (!validateFileType(file)) {
    return `${file.name} file type not allowed`;
  }
  
  return null;
};

// Copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Validate 4-digit code format
export const validateCode = (code: string): boolean => {
  return /^\d{4}$/.test(code);
};

// Format upload date
export const formatUploadDate = (uploadedAt: string): string => {
  const date = new Date(uploadedAt);
  return date.toLocaleString();
};
