import express, { Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { FileUpload, UploadSession, ApiResponse } from '../types';
import { db } from '../services/database';
import { storage } from '../services/storage';
import { 
  generateCode, 
  generateUniqueFilename, 
  validateFileType,
  calculateExpiryDate 
} from '../services/utils';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB per file (but total will be limited to 2GB)
    files: 1000 // Allow many files (limited by total size, not count)
  },
  fileFilter: (req, file, cb) => {
    if (!validateFileType(file.mimetype)) {
      return cb(new Error('File type not allowed'));
    }
    cb(null, true);
  }
});

// Upload files endpoint
router.post('/', upload.array('files'), asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  
  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No files provided'
    } as ApiResponse);
  }

  // Validate total upload size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const maxTotalSize = 2 * 1024 * 1024 * 1024; // 2GB total
  
  if (totalSize > maxTotalSize) {
    return res.status(400).json({
      success: false,
      error: `Total upload size exceeds 2GB limit. Current size: ${(totalSize / (1024 * 1024 * 1024)).toFixed(2)}GB`
    } as ApiResponse);
  }

  try {
    // Generate unique 4-digit code
    let code: string;
    let codeExists: boolean;
    do {
      code = generateCode();
      codeExists = await db.codeExists(code);
    } while (codeExists);

    // Process files
    const uploadedFiles: FileUpload[] = [];
    let totalSize = 0;

    for (const file of files) {
      const fileId = uuidv4();
      const uniqueFilename = generateUniqueFilename(file.originalname);
      
      // Save file to storage
      await storage.saveFile(file.buffer, uniqueFilename);
      
      const fileUpload: FileUpload = {
        id: fileId,
        code,
        originalName: file.originalname,
        filename: uniqueFilename,
        mimetype: file.mimetype,
        size: file.size,
        uploadedAt: new Date(),
        expiresAt: calculateExpiryDate(24), // 24 hours
        downloadCount: 0,
        isActive: true
      };

      uploadedFiles.push(fileUpload);
      totalSize += file.size;
    }

    // Create upload session
    const session: UploadSession = {
      code,
      files: uploadedFiles,
      totalSize,
      uploadedAt: new Date(),
      expiresAt: calculateExpiryDate(24),
      downloadCount: 0,
      isActive: true
    };

    // Save to database
    await db.saveSession(session);

    console.log(`Files uploaded successfully. Code: ${code}, Files: ${files.length}, Total size: ${totalSize} bytes`);

    res.json({
      success: true,
      data: {
        code,
        files: uploadedFiles.map(f => ({
          id: f.id,
          originalName: f.originalName,
          size: f.size,
          mimetype: f.mimetype
        })),
        totalSize,
        expiresAt: session.expiresAt
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload files'
    } as ApiResponse);
  }
}));

// Get upload info by code
router.get('/:code', asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params;
  
  if (!/^\d{4}$/.test(code)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid code format'
    } as ApiResponse);
  }

  const session = await db.getSession(code);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Code not found'
    } as ApiResponse);
  }

  if (!session.isActive || session.expiresAt < new Date()) {
    return res.status(410).json({
      success: false,
      error: 'Code has expired'
    } as ApiResponse);
  }

  res.json({
    success: true,
    data: {
      code: session.code,
      files: session.files.map(f => ({
        id: f.id,
        originalName: f.originalName,
        size: f.size,
        mimetype: f.mimetype
      })),
      totalSize: session.totalSize,
      uploadedAt: session.uploadedAt,
      expiresAt: session.expiresAt,
      downloadCount: session.downloadCount
    }
  } as ApiResponse);
}));

export default router;
