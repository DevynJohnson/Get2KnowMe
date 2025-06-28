// test-password-validation.js
// This is a simple test file to demonstrate password validation
// Run this with: node --env-file=.env test-password-validation.js

import User from '../server/src/models/User.js';
import connectToDatabase from '../server/src/config/connection.js';

// Connect to database
await connectToDatabase();

// Test password validation
async function testPasswordValidation() {
  console.log('🔒 Testing Password Validation Rules...\n');

  const testCases = [
    {
      description: 'Valid password',
      userData: { email: 'test1@example.com', username: 'testuser1', password: 'MySecure123!' },
      shouldPass: true
    },
    {
      description: 'Too short (7 characters)',
      userData: { email: 'test2@example.com', username: 'testuser2', password: 'Short1!' },
      shouldPass: false
    },
    {
      description: 'No uppercase letter',
      userData: { email: 'test3@example.com', username: 'testuser3', password: 'lowercase123!' },
      shouldPass: false
    },
    {
      description: 'No lowercase letter',
      userData: { email: 'test4@example.com', username: 'testuser4', password: 'UPPERCASE123!' },
      shouldPass: false
    },
    {
      description: 'No special character',
      userData: { email: 'test5@example.com', username: 'testuser5', password: 'NoSpecial123' },
      shouldPass: false
    },
    {
      description: 'Another valid password',
      userData: { email: 'test6@example.com', username: 'testuser6', password: 'StrongP@ssw0rd' },
      shouldPass: true
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`Testing: ${testCase.description}`);
      console.log(`Password: "${testCase.userData.password}"`);
      
      const user = new User(testCase.userData);
      await user.validate();
      
      if (testCase.shouldPass) {
        console.log('✅ PASS - Password validation succeeded as expected\n');
      } else {
        console.log('❌ FAIL - Password validation should have failed but passed\n');
      }
    } catch (error) {
      if (!testCase.shouldPass) {
        console.log('✅ PASS - Password validation failed as expected');
        console.log(`   Error: ${error.message}\n`);
      } else {
        console.log('❌ FAIL - Password validation should have passed but failed');
        console.log(`   Error: ${error.message}\n`);
      }
    }
  }

  console.log('🔒 Password validation test complete!');
  process.exit(0);
}

testPasswordValidation().catch(console.error);
