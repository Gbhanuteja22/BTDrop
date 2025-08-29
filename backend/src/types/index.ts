export interface FileUpload {
  id: string;
  code: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
  expiresAt: Date;
  downloadCount: number;
  maxDownloads?: number;
  isActive: boolean;
}

export interface UploadSession {
  code: string;
  files: FileUpload[];
  totalSize: number;
  uploadedAt: Date;
  expiresAt: Date;
  downloadCount: number;
  maxDownloads?: number;
  isActive: boolean;
}

export interface ChunkInfo {
  chunkNumber: number;
  totalChunks: number;
  filename: string;
  totalSize: number;
}

export interface DownloadRequest {
  code: string;
  filename?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
