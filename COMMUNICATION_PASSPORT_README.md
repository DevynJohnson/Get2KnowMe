# Communication Passport Features

## Overview
The Get2KnowMe application now includes a comprehensive Communication Passport system designed to help neurodivergent individuals share their communication needs and preferences with others.

## Features

### 1. Communication Passport Creation (`/create-passport`)
**Authenticated users can create/edit their Communication Passport with:**
- **Personal Information**: First name, last name, and optional preferred name
- **Diagnosis Options**: 
  - ASD (Autism Spectrum Disorder)
  - ADHD
  - OCD
  - Dyslexia
  - Tourette's Syndrome
  - Other (with custom input)
- **Communication Preferences**:
  - Speak slowly
  - Allow extra time to process
  - Avoid complicated questions or confusing language
  - Avoid specific words/phrases/topics
  - Other (with custom input)
- **Trusted Contact**: Name, phone (required), email (optional)
- **Profile Passcode**: Unique identifier for public access
- **Additional Information**: Free text for other important details
- **QR Code Generation**: Create QR codes for easy passport sharing

### 2. Public Passport Access (`/passport-lookup`)
**Anyone can access a Communication Passport by:**
- Entering the unique passcode
- Scanning a QR code with their smartphone
- Viewing the formatted passport information
- Contacting the trusted person if needed

### 3. Passport Display (`/passport/view/:passcode`)
**Clean, accessible display featuring:**
- Professional card layout
- Easy-to-read sections
- Print functionality
- QR code generation for sharing
- Emergency contact information
- Mobile-responsive design

## Navigation
- **View Passport**: Public access (no account required)
- **My Passport**: Authenticated users can create/edit their passport
- **Login/Register**: Authentication system

## API Endpoints

### Passport Routes (`/api/passport/`)
- `GET /generate-passcode` - Generate a new passcode
- `POST /create` - Create/update passport (authenticated)
- `GET /my-passport` - Get current user's passport (authenticated)
- `GET /public/:passcode` - Get passport by passcode (public)
- `DELETE /delete` - Delete passport (authenticated)

## Database Schema

### User Model Enhancement
The User model now includes a `communicationPassport` subdocument with:
- Personal and diagnosis information
- Communication preferences array
- Trusted contact object
- Unique profile passcode
- Additional information text
- Timestamps and active status

## Accessibility Features
- Screen reader friendly
- High contrast mode support
- Keyboard navigation
- Mobile responsive design
- Print-friendly layout
- Reduced motion support

## Usage Flow

### For Passport Owners:
1. Register/Login to the application
2. Navigate to "My Passport"
3. Fill out the Communication Passport form
4. Generate or create a unique passcode
5. Generate QR codes for easy sharing
6. Share the passcode or QR code with others as needed

### For Passport Viewers:
1. Go to "View Passport" (no account needed)
2. Enter the provided passcode OR scan a QR code
3. View the Communication Passport
4. Contact trusted person if support is needed

## QR Code Features
- **Easy Generation**: Create QR codes directly from your passport
- **Smartphone Compatible**: Works with any smartphone camera
- **Multiple Sharing Options**: 
  - Download QR code as PNG image
  - Print QR code with instructions
  - Copy passport link to clipboard
- **Emergency Ready**: Perfect for emergency situations where quick access is needed
- **Third-Party Friendly**: Allows caregivers, teachers, and support staff quick access

## Security Features
- Passcode-based access (no personal data exposure)
- Unique passcode validation
- Public routes only expose necessary information
- Authenticated routes for passport management
- Input validation and sanitization

## Future Enhancements
- Mobile application
- Batch QR code printing
- Passport templates
- Analytics for passport usage
- Multi-language support
