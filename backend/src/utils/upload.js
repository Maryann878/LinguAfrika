import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads', 'profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId-timestamp.extension
    const userId = req.userId || 'unknown';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${userId}-${uniqueSuffix}${ext}`);
  },
});

// Allowed MIME types for images
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

// Allowed file extensions
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// File filter with enhanced security
const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type. Only ${allowedExtensions.join(', ')} are allowed.`), false);
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(`Invalid file extension. Only ${allowedExtensions.join(', ')} are allowed.`), false);
  }

  // Check for potentially dangerous filenames
  const dangerousPatterns = /\.\.|\.exe|\.bat|\.sh|\.php|\.js|\.html|\.htm/i;
  if (dangerousPatterns.test(file.originalname)) {
    return cb(new Error('Invalid filename. Potentially dangerous characters detected.'), false);
  }

  cb(null, true);
};

// Configure multer with enhanced security
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1, // Only allow single file
    fields: 10, // Maximum number of non-file fields
    fieldNameSize: 100, // Maximum field name size
    fieldSize: 1024 * 1024, // Maximum field value size (1MB)
  },
});

// Middleware for single file upload
export const uploadProfileImageMiddleware = upload.single('profileImage');

