import { db } from './database';
import { storage } from './storage';

class CleanupService {
  private intervalId: NodeJS.Timeout | null = null;

  start(intervalMinutes: number = 60): void {
    if (this.intervalId) {
      console.log('Cleanup service is already running');
      return;
    }

    console.log(`Starting cleanup service with ${intervalMinutes} minute intervals`);
    
    // Run immediately
    this.cleanup();
    
    // Then run at regular intervals
    this.intervalId = setInterval(() => {
      this.cleanup();
    }, intervalMinutes * 60 * 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Cleanup service stopped');
    }
  }

  async cleanup(): Promise<void> {
    try {
      console.log('Running cleanup for expired files...');
      
      const expiredSessions = await db.getExpiredSessions();
      
      if (expiredSessions.length === 0) {
        console.log('No expired sessions found');
        return;
      }

      console.log(`Found ${expiredSessions.length} expired sessions`);
      
      for (const session of expiredSessions) {
        try {
          // Delete files from storage
          for (const file of session.files) {
            try {
              await storage.deleteFile(file.filename);
              console.log(`Deleted file: ${file.filename}`);
            } catch (error) {
              console.error(`Failed to delete file ${file.filename}:`, error);
            }
          }

          // Delete session from database
          await db.deleteSession(session.code);
          console.log(`Deleted session: ${session.code}`);

        } catch (error) {
          console.error(`Failed to cleanup session ${session.code}:`, error);
        }
      }

      console.log(`Cleanup completed. Processed ${expiredSessions.length} expired sessions`);

    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  async getStats(): Promise<{
    totalSessions: number;
    activeSessions: number;
    expiredSessions: number;
  }> {
    try {
      const allSessions = await db.getAllSessions();
      const expiredSessions = await db.getExpiredSessions();
      
      return {
        totalSessions: allSessions.length,
        activeSessions: allSessions.length - expiredSessions.length,
        expiredSessions: expiredSessions.length
      };
    } catch (error) {
      console.error('Failed to get cleanup stats:', error);
      return {
        totalSessions: 0,
        activeSessions: 0,
        expiredSessions: 0
      };
    }
  }
}

export const cleanupService = new CleanupService();
