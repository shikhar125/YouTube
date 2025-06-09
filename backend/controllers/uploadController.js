import asyncHandler from 'express-async-handler';
import path from 'path';
import fs from 'fs';

// @desc    Upload a file
// @route   POST /api/upload
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  
  // Construct the full URL for the uploaded file
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.BASE_URL 
    : `http://localhost:${process.env.PORT || 5000}`;
  
  const fileUrl = `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;
  
  res.json({
    message: 'File uploaded successfully',
    fileUrl,
    filePath: req.file.path,
  });
});

export { uploadFile };