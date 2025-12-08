import { connectDB } from '../config/database.js';
import { seedDemoData, clearDemoData } from '../utils/seedData.js';

const command = process.argv[2];

async function run() {
  try {
    await connectDB();
    
    if (command === 'clear') {
      await clearDemoData();
      console.log('\n✅ Demo data cleared successfully!');
    } else {
      await seedDemoData();
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();

