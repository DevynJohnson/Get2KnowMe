import { beforeAll, afterAll, afterEach, describe, expect, test } from '@jest/globals';
import { jest } from '@jest/globals';

import { connectTestDB, disconnectTestDB, clearTestDB } from './setupTestDB.js';
import mongoose from 'mongoose';

// ✅ Mock the auth middleware dynamically before importing app
beforeAll(async () => {
  jest.unstable_mockModule(
    '../server/src/middleware/authenticateTokenMiddleware.js',
    () => ({
      default: (req, res, next) => {
        req.user = {
          _id: new mongoose.Types.ObjectId(),
          username: 'testuser',
          consent: {
            agreedToTerms: true,
            ageConfirmed: true,
          },
        };
        next();
      },
    })
  );

  await connectTestDB();
});

// ✅ Import app and User *after* the mock
const request = (await import('supertest')).default;
const app = (await import('../server/app.js')).default;
const User = (await import('../server/src/models/User.js')).default;

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('Passport Routes', () => {
  test('GET /api/passport/generate-passcode - should generate a passcode', async () => {
    const res = await request(app).get('/api/passport/generate-passcode');
    expect(res.statusCode).toBe(200);
    expect(res.body.passcode).toMatch(/^[A-Z0-9]{6}$/);
  });

  test('POST /api/passport/create - should save communication passport with normalized phone and passcode', async () => {
    const passportData = {
      email: 'test@example.com',
      password: 'Test123!',
      username: 'testuser',
      consent: {
        agreedToTerms: true,
        ageConfirmed: true,
      },
      communicationPassport: {
        firstName: 'Test',
        lastName: 'User',
        preferredName: 'T',
        diagnosis: 'ADHD',
        diagnoses: ['ADHD'],
        customDiagnosis: '',
        healthAlert: ['None'],
        trustedContact: {
          name: 'Jane Doe',
          phone: '555-555-1234',
          email: 'jane@example.com',
        },
        profilePasscode: 'ABC123',
      }
    };

    const res = await request(app)
      .post('/api/passport/create')
      .send(passportData);

    expect(res.statusCode).toBe(200);
    expect(res.body.passport).toHaveProperty('profilePasscode', 'ABC123');
    expect(res.body.passport.trustedContact.phone).toMatch(/^\+1/); // E.164 format
    expect(res.body.message).toBe('Communication passport saved successfully');
  });

  // ... Include the other test cases here, updating as needed
});
