import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.response?.status === 413) {
      throw new Error('File too large');
    }
    
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    
    throw error;
  }
);

export interface FileInfo {
  id: string;
  originalName: string;
  size: number;
  mimetype: string;
}

export interface UploadResponse {
  success: boolean;
  data?: {
    code: string;
    files: FileInfo[];
    totalSize: number;
    expiresAt: string;
  };
  error?: string;
}

export interface DownloadInfo {
  success: boolean;
  data?: {
    code: string;
    files: FileInfo[];
    totalSize: number;
    uploadedAt: string;
    expiresAt: string;
    downloadCount: number;
  };
  error?: string;
}

// Upload files and get share code
export const uploadFiles = async (files: File[], shareType?: string): Promise<UploadResponse> => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('files', file);
  });

  if (shareType) {
    formData.append('shareType', shareType);
  }

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    },
  });

  return response.data;
};

// Download files by code
export const downloadFiles = async (code: string): Promise<DownloadInfo> => {
  const response = await api.get(`/download/${code}`);
  return response.data;
};

// Get download info by code
export const getDownloadInfo = async (code: string): Promise<DownloadInfo> => {
  const response = await api.get(`/download/${code}`);
  return response.data;
};

// Generate download URL for a specific file
export const getDownloadUrl = (code: string, fileId: string): string => {
  return `${API_BASE_URL}/download/${code}/${fileId}`;
};
