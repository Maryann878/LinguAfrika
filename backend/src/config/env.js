import dotenv from 'dotenv';

dotenv.config();

// Parse CORS_ORIGIN - can be a single origin or comma-separated list
const parseCorsOrigin = (originString) => {
  if (!originString) return 'http://localhost:3000';
  // If it contains commas, split into array, otherwise return as single string
  if (originString.includes(',')) {
    return originString.split(',').map(origin => origin.trim());
  }
  return originString.trim();
};

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/linguafrika',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'),
};


