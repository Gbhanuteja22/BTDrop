// File validation and utility functions

export const MAX_TOTAL_SIZE = 2 * 1024 * 1024 * 1024; // 2GB total

export const ALLOWED_FILE_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  
  // Archives
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'application/x-tar',
  'application/gzip',
  
  // Code files
  'text/html',
  'text/css',
  'text/javascript',
  'application/json',
  'text/xml',
  
  // Videos
  'video/mp4',
  'video/avi',
  'video/mov',
  'video/wmv',
  'video/flv',
  
  // Audio
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/m4a',
];

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileValidationError(file: File, currentFiles: File[]): string | null {
  // Check total size limit including new file
  const currentTotalSize = getTotalFileSize(currentFiles);
  if (currentTotalSize + file.size > MAX_TOTAL_SIZE) {
    const remainingSpace = MAX_TOTAL_SIZE - currentTotalSize;
    return `Total size limit exceeded. ${formatFileSize(remainingSpace)} remaining of ${formatFileSize(MAX_TOTAL_SIZE)} total`;
  }
  
  // Check file type (optional - you can remove this if you want to allow all file types)
  if (!ALLOWED_FILE_TYPES.includes(file.type) && file.type !== '') {
    return `File type "${file.type}" is not allowed`;
  }
  
  // Check for empty files
  if (file.size === 0) {
    return 'Empty files are not allowed';
  }
  
  return null;
}

export function isValidFileType(file: File): boolean {
  return ALLOWED_FILE_TYPES.includes(file.type) || file.type === '';
}

export function getTotalFileSize(files: File[]): number {
  return files.reduce((total, file) => total + file.size, 0);
}

export function getFileIcon(file: File): string {
  const type = file.type.toLowerCase();
  
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('video/')) return '🎥';
  if (type.startsWith('audio/')) return '🎵';
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
  if (type.includes('powerpoint') || type.includes('presentation')) return '📈';
  if (type.includes('zip') || type.includes('rar') || type.includes('7z') || type.includes('tar') || type.includes('gzip')) return '📦';
  if (type.includes('javascript') || type.includes('json') || type.includes('html') || type.includes('css')) return '💻';
  if (type.includes('text')) return '📄';
  
  return '📁';
}
