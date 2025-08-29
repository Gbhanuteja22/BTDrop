import fs from 'fs/promises';
import path from 'path';
import { FileUpload } from '../types';

class LocalFileStorage {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(__dirname, '../../uploads');
    this.ensureUploadsDir();
  }

  private async ensureUploadsDir(): Promise<void> {
    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    }
  }

  async saveFile(buffer: Buffer, filename: string): Promise<string> {
    const filePath = path.join(this.uploadsDir, filename);
    await fs.writeFile(filePath, buffer);
    return filePath;
  }

  async getFile(filename: string): Promise<Buffer> {
    const filePath = path.join(this.uploadsDir, filename);
    return await fs.readFile(filePath);
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadsDir, filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file ${filename}:`, error);
    }
  }

  async fileExists(filename: string): Promise<boolean> {
    const filePath = path.join(this.uploadsDir, filename);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadsDir, filename);
  }

  async getFileStats(filename: string): Promise<{ size: number; mtime: Date } | null> {
    const filePath = path.join(this.uploadsDir, filename);
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        mtime: stats.mtime
      };
    } catch {
      return null;
    }
  }
}

// Storage service interface for easy swapping (e.g., with MinIO)
export interface StorageService {
  saveFile(buffer: Buffer, filename: string): Promise<string>;
  getFile(filename: string): Promise<Buffer>;
  deleteFile(filename: string): Promise<void>;
  fileExists(filename: string): Promise<boolean>;
  getFilePath(filename: string): string;
  getFileStats(filename: string): Promise<{ size: number; mtime: Date } | null>;
}

// Export the current storage implementation
export const storage: StorageService = new LocalFileStorage();
