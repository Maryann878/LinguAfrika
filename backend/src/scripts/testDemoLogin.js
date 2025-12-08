import { connectDB } from '../config/database.js';
import { User } from '../models/User.js';

async function testLogin() {
  try {
    await connectDB();
    
    const demoUser = await User.findOne({ email: 'demo@linguafrika.com' }).select('+password');
    
    if (!demoUser) {
      console.log('❌ Demo user not found!');
      console.log('Run: npm run seed:demo');
      process.exit(1);
    }
    
    console.log('✅ Demo user found!');
    console.log('Email:', demoUser.email);
    console.log('Username:', demoUser.username);
    console.log('First Name:', demoUser.firstName);
    console.log('Last Name:', demoUser.lastName);
    console.log('Is Verified:', demoUser.isVerified);
    
    // Test password
    const testPassword = 'Demo123!';
    const isValid = await demoUser.comparePassword(testPassword);
    
    if (isValid) {
      console.log('✅ Password is correct!');
      console.log('\n📝 Login Credentials:');
      console.log('   Email: demo@linguafrika.com');
      console.log('   Password: Demo123!');
      console.log('   Username (alternative): demo_user');
    } else {
      console.log('❌ Password verification failed!');
      console.log('Expected: Demo123!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testLogin();

