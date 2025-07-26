import mongoose from 'mongoose';
import User from '../../server/src/models/User.js'; // Adjust path to your User model

async function fixedMigration() {
  let sourceConnection, targetConnection;
  
  try {
    // Your base connection string (without database name)
    const baseConnectionString = process.env.MONGO_DB_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;
    console.log('Base connection string:', baseConnectionString);

    // Connect to source database (current default database)
    sourceConnection = await mongoose.createConnection(baseConnectionString);
    console.log('✓ Connected to source database');

    // Connect to target database (explicitly specify Get2KnowMe)
    const targetConnectionString = baseConnectionString + '/Get2KnowMe';
    targetConnection = await mongoose.createConnection(targetConnectionString);
    console.log('✓ Connected to target database (Get2KnowMe)');

    // Get the User model for both connections
    const SourceUser = sourceConnection.model('User', User.schema);
    const TargetUser = targetConnection.model('User', User.schema);

    // Clear target database first (in case of previous failed attempts)
    await TargetUser.deleteMany({});
    console.log('🧹 Cleared target database');

    // Fetch all users from source database
    const sourceUsers = await SourceUser.find({});
    console.log(`\n📊 Found ${sourceUsers.length} users to migrate\n`);

    let migratedCount = 0;
    let fixedPassportCount = 0;

    for (const sourceUser of sourceUsers) {
      try {
        console.log(`🔄 Migrating ${sourceUser.email || sourceUser.username}...`);

        // Prepare the user data for migration
        const userData = sourceUser.toObject();
        delete userData._id; // Let MongoDB generate new _id

        // Handle communication passport fixes during migration
        if (userData.communicationPassport) {
          console.log(`  🔧 Fixing communication passport...`);
          
          // Check if the passport has the corruption issue (missing core fields)
          const hasCorruption = !userData.communicationPassport.firstName && 
                               !userData.communicationPassport.lastName && 
                               !userData.communicationPassport.profilePasscode;

          if (hasCorruption) {
            console.log(`  ⚠️  Detected corrupted passport - creating clean structure`);
            
            // Create a clean, minimal passport structure
            userData.communicationPassport = {
              firstName: '',
              lastName: '',
              preferredName: '',
              preferredPronouns: userData.communicationPassport.preferredPronouns || 'He/Him',
              diagnoses: userData.communicationPassport.diagnoses || [],
              healthAlert: userData.communicationPassport.healthAlert || ['None'],
              communicationPreferences: userData.communicationPassport.communicationPreferences || [],
              triggers: '',
              likes: '',
              dislikes: '',
              profilePasscode: `temp${String(fixedPassportCount + 1).padStart(3, '0')}`, // Unique temp passcode
              otherInformation: '',
              trustedContact: {
                name: '',
                phone: '',
                countryCode: 'GB',
                email: ''
              },
              isActive: userData.communicationPassport.isActive !== undefined ? userData.communicationPassport.isActive : true,
              createdAt: userData.communicationPassport.createdAt || new Date(),
              updatedAt: new Date()
            };
            fixedPassportCount++;
            console.log(`  ✓ Created clean passport structure with passcode: temp${String(fixedPassportCount).padStart(3, '0')}`);
          } else {
            console.log(`  ✓ Passport appears healthy - preserving as-is`);
            // Just update the timestamp
            userData.communicationPassport.updatedAt = new Date();
          }
        } else {
          console.log(`  ℹ️  No communication passport to migrate`);
        }

        // Create the user in the target database
        const newUser = new TargetUser(userData);
        await newUser.save();
        
        console.log(`  ✓ Successfully migrated ${sourceUser.email || sourceUser.username}`);
        migratedCount++;

      } catch (error) {
        console.error(`  ✗ Error migrating ${sourceUser.email || sourceUser.username}:`, error.message);
      }
    }

    // Migration summary
    console.log(`\n=== MIGRATION SUMMARY ===`);
    console.log(`✓ Successfully migrated: ${migratedCount} users`);
    console.log(`🔧 Fixed communication passports: ${fixedPassportCount}`);

    // Verification - check migrated users
    console.log(`\n=== VERIFICATION ===`);
    const targetUsers = await TargetUser.find({});
    
    console.log(`Target database now has ${targetUsers.length} users:`);
    for (const user of targetUsers) {
      console.log(`\n👤 ${user.email || user.username}:`);
      console.log(`  - User migrated: ✓`);
      console.log(`  - Has passport: ${!!user.communicationPassport ? '✓' : '✗'}`);
      
      if (user.communicationPassport) {
        console.log(`  - Profile passcode: ${user.communicationPassport.profilePasscode || 'missing'}`);
        console.log(`  - Can decrypt: ${user.communicationPassport.isActive !== undefined ? '✓' : '✗'}`);
      }
    }

    console.log(`\n🎉 Migration completed successfully!`);
    console.log(`📝 Next steps:`);
    console.log(`   1. Update your .env file: MONGO_DB_URI=${baseConnectionString}/Get2KnowMe`);
    console.log(`   2. Test your application with the new database`);
    console.log(`   3. Users with temp passcodes can edit their passports`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    if (sourceConnection) {
      await sourceConnection.close();
      console.log('✓ Closed source database connection');
    }
    if (targetConnection) {
      await targetConnection.close();
      console.log('✓ Closed target database connection');
    }
  }
}

fixedMigration();