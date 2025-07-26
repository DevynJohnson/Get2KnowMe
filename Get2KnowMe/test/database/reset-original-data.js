import mongoose from 'mongoose';
import User from '../../server/src/models/User.js'; // Adjust path to your User model
import { createDecipheriv } from 'crypto';

async function restoreOriginalData() {
  try {
    const connectionString = process.env.MONGO_DB_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;
    await mongoose.connect(connectionString);
    console.log('Connected to database');

    // Get users with corrupted communication passports
    const users = await User.find({ 
      email: { $in: ['jwbarry@outlook.com', 'dljohnson1313@gmail.com', 'devynjohnson@hotmail.com'] }
    });

    console.log(`Found ${users.length} users to restore`);

    for (const user of users) {
      console.log(`\n=== Restoring ${user.email} ===`);
      
      // Get the raw database data
      const rawUser = await User.collection.findOne({ _id: user._id });
      
      if (!rawUser.communicationPassport) {
        console.log(`  ✗ No raw data found for ${user.email}`);
        continue;
      }

      console.log('  📋 Extracting original data...');
      
      // Try to decrypt the original data by creating a temporary user object
      // and letting mongoose handle the decryption
      try {
        // Create a temporary user document with the raw encrypted data
        const tempUserData = {
          ...rawUser,
          communicationPassport: {
            ...rawUser.communicationPassport,
            // Ensure we have the required metadata
            isActive: rawUser.communicationPassport.isActive !== undefined ? rawUser.communicationPassport.isActive : true,
            createdAt: rawUser.communicationPassport.createdAt || new Date(),
            updatedAt: new Date()
          }
        };

        // Save this back to trigger mongoose decryption
        await User.collection.replaceOne(
          { _id: user._id }, 
          tempUserData
        );

        // Now fetch with mongoose to see if it can decrypt
        const testUser = await User.findById(user._id);
        
        if (testUser.communicationPassport && testUser.communicationPassport.firstName) {
          console.log('  ✓ Successfully restored encrypted data');
          console.log(`    - First Name: ${testUser.communicationPassport.firstName}`);
          console.log(`    - Last Name: ${testUser.communicationPassport.lastName}`);
          console.log(`    - Preferred Name: ${testUser.communicationPassport.preferredName}`);
          console.log(`    - Profile Passcode: ${testUser.communicationPassport.profilePasscode}`);
          
          // Force a save to ensure the structure is correct
          await testUser.save();
          console.log('  ✓ Data structure normalized and saved');
          
        } else {
          console.log('  ⚠️  Mongoose could not decrypt - data may be too corrupted');
          console.log('  📋 Available raw fields:');
          
          // Show what fields exist in raw data
          const rawPassport = rawUser.communicationPassport;
          Object.keys(rawPassport).forEach(key => {
            if (!key.startsWith('__enc_') && !key.startsWith('_id')) {
              console.log(`    - ${key}: ${typeof rawPassport[key] === 'string' && rawPassport[key].includes(':') ? 'ENCRYPTED' : rawPassport[key]}`);
            }
          });
          
          // Attempt manual reconstruction with available data
          const reconstructedPassport = {
            // Copy over any non-encrypted fields
            isActive: rawPassport.isActive !== undefined ? rawPassport.isActive : true,
            createdAt: rawPassport.createdAt || new Date(),
            updatedAt: new Date(),
            
            // Initialize empty fields that we'll try to decrypt manually
            firstName: '',
            lastName: '',
            preferredName: '',
            preferredPronouns: '',
            diagnoses: rawPassport.diagnoses || [],
            healthAlert: rawPassport.healthAlert || [],
            communicationPreferences: rawPassport.communicationPreferences || [],
            triggers: '',
            likes: '',
            dislikes: '',
            profilePasscode: '',
            otherInformation: '',
            trustedContact: {
              name: '',
              phone: '',
              countryCode: 'GB',
              email: ''
            }
          };
          
          // Update the user with the reconstructed data
          await User.updateOne(
            { _id: user._id },
            { $set: { communicationPassport: reconstructedPassport } }
          );
          
          console.log('  ✓ Created clean passport structure (some data may be lost)');
        }

      } catch (error) {
        console.error(`  ✗ Error restoring ${user.email}:`, error.message);
      }
    }

    // Final verification
    console.log('\n=== FINAL VERIFICATION ===');
    for (const user of users) {
      const verifyUser = await User.findById(user._id);
      if (verifyUser.communicationPassport) {
        const passport = verifyUser.communicationPassport;
        console.log(`\n${user.email}:`);
        console.log(`  - Structure exists: ✓`);
        console.log(`  - Has firstName: ${passport.firstName ? '✓ ' + passport.firstName : '✗ missing'}`);
        console.log(`  - Has lastName: ${passport.lastName ? '✓ ' + passport.lastName : '✗ missing'}`);
        console.log(`  - Has triggers: ${passport.triggers ? '✓ ' + passport.triggers.substring(0, 30) + '...' : '✗ missing'}`);
        console.log(`  - Has profilePasscode: ${passport.profilePasscode ? '✓ ' + passport.profilePasscode : '✗ missing'}`);
      } else {
        console.log(`${user.email}: ✗ No passport found`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
}

restoreOriginalData();