import mongoose from 'mongoose';
import User from '../../server/src/models/User.js'; // Adjust path to your User model

async function checkCommunicationPassports() {
  try {
    // Debug environment variables
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO') || key.includes('DATABASE')));
    
    const connectionString = process.env.MONGO_DB_URI || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('No MongoDB connection string found in environment variables');
    }
    
    // Connect to database
    await mongoose.connect(connectionString);
    console.log('Connected to database');

    // Get a few users to check (adjust the limit as needed)
    const users = await User.find({}).limit(5);
    
    console.log(`\n=== CHECKING ${users.length} USERS ===\n`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`--- USER ${i + 1}: ${user.email || user.username} ---`);
      console.log('1. User ID:', user._id.toString());
      console.log('2. CommunicationPassport exists:', !!user.communicationPassport);
      console.log('3. Type:', typeof user.communicationPassport);
      console.log('4. Value:', user.communicationPassport);
      console.log('5. Keys (if object):', user.communicationPassport ? Object.keys(user.communicationPassport) : 'N/A');
      console.log('6. Is empty object:', user.communicationPassport && Object.keys(user.communicationPassport).length === 0);
      
      // Check raw DB data
      const rawUser = await User.collection.findOne({ _id: user._id });
      console.log('7. Raw DB communicationPassport:', rawUser.communicationPassport);
      console.log('8. Raw DB keys:', rawUser.communicationPassport ? Object.keys(rawUser.communicationPassport) : 'N/A');
      console.log('\n');
    }

    // Check if any users have communication passports
    const usersWithPassports = await User.countDocuments({ 
      communicationPassport: { $exists: true, $ne: null, $ne: {} } 
    });
    console.log(`\n=== SUMMARY ===`);
    console.log(`Total users with non-empty communication passports: ${usersWithPassports}`);
    console.log(`Total users checked: ${users.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Run the check
checkCommunicationPassports();