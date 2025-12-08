import { connectDB } from '../config/database.js';
import { User } from '../models/User.js';
import { seedDemoData } from '../utils/seedData.js';

export async function ensureDemoAccount() {
  try {
    console.log('🔍 Checking for demo account...');
    
    // Check if demo user exists (DB should already be connected from server.js)
    const demoUser = await User.findOne({ email: 'demo@linguafrika.com' });
    
    if (!demoUser) {
      console.log('🌱 Demo account not found. Seeding demo data...');
      await seedDemoData();
      console.log('✅ Demo account and data created successfully!');
    } else {
      console.log('✅ Demo account already exists');
    }
  } catch (error) {
    console.error('❌ Error ensuring demo account:', error);
    // Don't throw - allow server to start even if demo account creation fails
  }
}

// Only run as standalone script if called directly (not when imported)
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || 
                     process.argv[1]?.includes('ensureDemoAccount.js');

if (isMainModule) {
  (async () => {
    await connectDB();
    await ensureDemoAccount();
    process.exit(0);
  })();
}

