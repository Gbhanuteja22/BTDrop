import { FileUpload, UploadSession } from '../types';

// In-memory storage - replace with PostgreSQL in production
class MemoryStorage {
  private sessions: Map<string, UploadSession> = new Map();
  private files: Map<string, FileUpload> = new Map();

  async saveSession(session: UploadSession): Promise<void> {
    this.sessions.set(session.code, session);
    
    // Also save individual files for easier lookup
    session.files.forEach(file => {
      this.files.set(file.id, file);
    });
  }

  async getSession(code: string): Promise<UploadSession | null> {
    const session = this.sessions.get(code);
    return session || null;
  }

  async getFile(fileId: string): Promise<FileUpload | null> {
    const file = this.files.get(fileId);
    return file || null;
  }

  async updateSession(code: string, updates: Partial<UploadSession>): Promise<void> {
    const session = this.sessions.get(code);
    if (session) {
      Object.assign(session, updates);
      this.sessions.set(code, session);
    }
  }

  async deleteSession(code: string): Promise<void> {
    const session = this.sessions.get(code);
    if (session) {
      // Remove individual files
      session.files.forEach(file => {
        this.files.delete(file.id);
      });
      
      // Remove session
      this.sessions.delete(code);
    }
  }

  async getExpiredSessions(): Promise<UploadSession[]> {
    const now = new Date();
    const expired: UploadSession[] = [];
    
    this.sessions.forEach(session => {
      if (session.expiresAt < now) {
        expired.push(session);
      }
    });
    
    return expired;
  }

  async getAllSessions(): Promise<UploadSession[]> {
    return Array.from(this.sessions.values());
  }

  async codeExists(code: string): Promise<boolean> {
    return this.sessions.has(code);
  }
}

// Singleton instance
export const memoryStorage = new MemoryStorage();

// Database service interface for easy swapping
export interface DatabaseService {
  saveSession(session: UploadSession): Promise<void>;
  getSession(code: string): Promise<UploadSession | null>;
  getFile(fileId: string): Promise<FileUpload | null>;
  updateSession(code: string, updates: Partial<UploadSession>): Promise<void>;
  deleteSession(code: string): Promise<void>;
  getExpiredSessions(): Promise<UploadSession[]>;
  getAllSessions(): Promise<UploadSession[]>;
  codeExists(code: string): Promise<boolean>;
}

// Export the current storage implementation
export const db: DatabaseService = memoryStorage;
