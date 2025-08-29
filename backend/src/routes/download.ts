import express, { Request, Response } from 'express';
import path from 'path';
import { ApiResponse } from '../types';
import { db } from '../services/database';
import { storage } from '../services/storage';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Get files info by code
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

// Download specific file
router.get('/:code/:fileId', asyncHandler(async (req: Request, res: Response) => {
  const { code, fileId } = req.params;
  
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

  const file = session.files.find(f => f.id === fileId);
  
  if (!file) {
    return res.status(404).json({
      success: false,
      error: 'File not found'
    } as ApiResponse);
  }

  try {
    // Check if file exists in storage
    const fileExists = await storage.fileExists(file.filename);
    
    if (!fileExists) {
      return res.status(404).json({
        success: false,
        error: 'File not found in storage'
      } as ApiResponse);
    }

    // Increment download count
    session.downloadCount += 1;
    file.downloadCount += 1;
    await db.updateSession(code, { downloadCount: session.downloadCount });

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Length', file.size.toString());

    // Stream the file
    const filePath = storage.getFilePath(file.filename);
    res.sendFile(filePath);

    console.log(`File downloaded: ${file.originalName} (${file.size} bytes) for code ${code}`);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download file'
    } as ApiResponse);
  }
}));

// Download all files as ZIP (optional enhancement)
router.get('/:code/zip', asyncHandler(async (req: Request, res: Response) => {
  // This could be implemented later to create a ZIP of all files
  res.status(501).json({
    success: false,
    error: 'ZIP download not implemented yet'
  } as ApiResponse);
}));

export default router;
