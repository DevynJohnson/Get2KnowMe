import mongoose from 'mongoose';
import User from '../../server/src/models/User.js'; // Adjust path to your User model

async function fixCommunicationPassports() {
  try {
    // Connect to database
    const connectionString = process.env.MONGO_DB_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;
    await mongoose.connect(connectionString);
    console.log('Connected to database');

    // Get all users with corrupted communication passports
    const users = await User.find({});
    console.log(`Found ${users.length} users to check`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      const rawUser = await User.collection.findOne({ _id: user._id });
      
      // Skip users with no communication passport data at all
      if (!rawUser.communicationPassport) {
        console.log(`Skipping ${user.email} - no communication passport data`);
        skippedCount++;
        continue;
      }

      // Skip users whose mongoose model can already decrypt properly
      if (user.communicationPassport && Object.keys(user.communicationPassport).length > 0) {
        console.log(`Skipping ${user.email} - already working`);
        skippedCount++;
        continue;
      }

      console.log(`Fixing ${user.email}...`);

      try {
        // Force mongoose to re-process the encrypted data by touching the document
        await User.updateOne(
          { _id: user._id },
          { $set: { updatedAt: new Date() } }
        );

        // If that doesn't work, we need to decrypt manually and re-save
        const updatedUser = await User.findById(user._id);
        
        if (!updatedUser.communicationPassport || Object.keys(updatedUser.communicationPassport).length === 0) {
          // The subdocument is corrupted - we need to reconstruct it
          console.log(`  - Reconstructing subdocument structure for ${user.email}`);
          
          // Create a new communication passport object
          const newPassport = {
            isActive: rawUser.communicationPassport.isActive || true,
            createdAt: rawUser.communicationPassport.createdAt || new Date(),
            updatedAt: new Date()
          };

          // Save with the basic structure first
          await User.updateOne(
            { _id: user._id },
            { $set: { communicationPassport: newPassport, updatedAt: new Date() } }
          );

          // Now try to re-save to trigger proper encryption
          const userToFix = await User.findById(user._id);
          await userToFix.save();
        }

        fixedCount++;
        console.log(`  ✓ Fixed ${user.email}`);

      } catch (error) {
        console.error(`  ✗ Error fixing ${user.email}:`, error.message);
      }
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Fixed: ${fixedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Total: ${users.length}`);

    // Verify the fixes
    console.log('\n=== VERIFICATION ===');
    const verifyUsers = await User.find({}).limit(3);
    for (const user of verifyUsers) {
      console.log(`${user.email}: CommunicationPassport works = ${!!user.communicationPassport && Object.keys(user.communicationPassport).length > 0}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Run the fix
fixCommunicationPassports();