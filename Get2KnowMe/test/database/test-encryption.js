import mongoose from 'mongoose';
import User from '../../server/src/models/User.js'; // Adjust path to your User model

async function testEncryption() {
  try {
    // Connect to database
    const connectionString = process.env.MONGO_DB_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;
    await mongoose.connect(connectionString);
    console.log('Connected to database');

    // Create a test user with communication passport
    const testUser = new User({
      email: 'encryption-test@example.com',
      password: 'TestPassword123!',
      username: 'encryptiontest',
      consent: {
        agreedToTerms: true,
        ageConfirmed: true
      },
      communicationPassport: {
        firstName: 'Test',
        lastName: 'User',
        preferredName: 'Tester',
        preferredPronouns: 'They/Them',
        diagnoses: ['Autism Spectrum Disorder (ASD)'],
        healthAlert: ['None'],
        communicationPreferences: ['I will understand things better if you speak slowly'],
        triggers: 'Loud noises',
        likes: 'Quiet spaces',
        dislikes: 'Crowds',
        profilePasscode: 'test123',
        otherInformation: 'This is a test passport'
      }
    });

    // Save the user
    await testUser.save();
    console.log('✓ Test user created successfully');

    // Retrieve the user and check if encryption worked
    const retrievedUser = await User.findById(testUser._id);
    console.log('✓ User retrieved successfully');

    // Check if communication passport is accessible
    if (retrievedUser.communicationPassport) {
      console.log('✓ Communication passport exists');
      console.log('  - First Name:', retrievedUser.communicationPassport.firstName);
      console.log('  - Triggers:', retrievedUser.communicationPassport.triggers);
      console.log('  - Profile Passcode:', retrievedUser.communicationPassport.profilePasscode);
    } else {
      console.log('✗ Communication passport not found');
    }

    // Check raw database to see if data is encrypted
    const rawUser = await User.collection.findOne({ _id: testUser._id });
    console.log('\n=== RAW DATABASE CHECK ===');
    console.log('Encrypted firstName:', rawUser.communicationPassport?.firstName);
    console.log('Encrypted triggers:', rawUser.communicationPassport?.triggers);
    
    // Clean up - delete the test user
    await User.deleteOne({ _id: testUser._id });
    console.log('✓ Test user cleaned up');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Run the test
testEncryption();