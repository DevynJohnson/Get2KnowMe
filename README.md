# Get2KnowMe [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A web application designed to empower neurodivergent individuals by providing them with a digital platform to create and share their communication needs and preferences with others.

## Description

Get2KnowMe is made for being understood and its purpose is to help people be seen for who they are - not just their diagnosis.

Together we can make communication fairer, kinder, and more human. Get2KnowMe provides a simple and secure platform that helps people communicate their needs, preferences, and personality - especially when words are difficult to find.

It's designed for neurodivergent individuals, people with communication differences, or anybody who wants to be better understood.

With Get2KnowMe, you can create a Digital Communication Passport: a personalized profile that explains how you communicate, any adaptations or accommodations you need, and what support is helpful for you, as well as the things that make you feel safe, seen and heard.

Each passport comes with a unique QR code, allowing you to easily share your information with teachers, healthcare workers, emergency workers, employers, caregivers, friends, or anyone you meet.

## Key Features

- **Digital Communication Passport Creation**: Personalized profiles with communication preferences and support needs
- **QR Code Generation**: Instant sharing capabilities through scannable QR codes
- **Secure Passcode System**: Alternative sharing method using unique alphanumeric codes
- **Trusted Contact Integration**: Emergency contact information with privacy controls
- **Responsive Design**: Optimized for mobile devices and various screen sizes
- **Print-Friendly Format**: Clean, professional printing capabilities for physical copies
- **Accessibility Options**: Accessibility customization options including toggle on/off options for colorblindness and dyslexia-friendly fonts
- **Advanced Security & Data Encryption**: All sensitive personal data is encrypted at rest and protected by strong authentication, ensuring your information is always safe

## Screenshots

![Home Page](Get2KnowMe/client/public/assets/screenshots/get2knowme_homepage_screenshot.png)
<p align="center"><em><strong>Main landing page with navigation to key features</strong></em></p>

![Profile Page](Get2KnowMe/client/public/assets/screenshots/get2knowme_myProfile_screenshot.png)
<p align="center"><em><strong>User profile page with Quick Action panel, allowing easy access to profile customization options</strong></em></p>

![Educational Tools](Get2KnowMe/client/public/assets/screenshots/get2knowme_learnMore_screenshot.png)
<p align="center"><em><strong>Educational information about various neurodivergent conditions and how Get2KnowMe can offer support</strong></em></p>

![Appearance Customization](Get2KnowMe/client/public/assets/screenshots/appearance_settings.png)
<p align="center"><em><strong>Appearance setting options, including Light/Dark Modes, color pallate selection, and a colorblind mode</strong></em></p>

![Communication Passport](Get2KnowMe/client/public/assets/screenshots/passport_example.png)
<p align="center"><em><strong>Example of a communication passport displaying user preferences and needs</strong></em></p>

![QR Code Sharing](Get2KnowMe/client/public/assets/screenshots/qr_example.png)
<p align="center"><em><strong>QR code generation for easy sharing of communication passports</strong></em></p>




## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Testing](#testing)
- [Credits](#credits)
- [GDPR & Privacy Compliance](#gdpr--privacy-compliance)
- [License](#license)

## Installation

### Live Application
Get2KnowMe is deployed and available for use at: https://get2knowme.co.uk or https://get2know.me

No installation is required - simply visit the website to start creating your communication passport.

### Development Setup

To run Get2KnowMe locally for development or contribution:

1. **Fork and clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   - Copy `.env.example` to `.env` in the project root:
     ```bash
     cp .env.example .env
     ```
   - Fill in the required values in your `.env` file. Do not commit your actual secrets or production credentials.
   - If you are contributing, use placeholder/test values as provided in `.env.example`.
4. **Start the development server**
   ```bash
   npm run dev
   ```

#### Environment Variables Best Practices
- **Never commit real secrets or production credentials to the repository.**
- Use a `.env.example` file to document all required environment variables and provide safe placeholder values.
- Contributors should create their own `.env` file locally based on `.env.example`.
- Production secrets should only be set in your deployment environment, never in version control.

## Usage

### For Users
1. **Register/Login**: Create an account or log in to access the platform
2. **Create Passport**: Fill out the communication passport form with your preferences and needs
3. **Generate QR Code**: Create a shareable QR code for your passport
4. **Share**: Provide the QR code or passcode to others when communication support is needed

### For Recipients
1. **Scan QR Code**: Use any smartphone camera to scan the provided QR code
2. **Enter Passcode**: Alternatively, visit the lookup page and enter the provided passcode
3. **View Passport**: Access the communication preferences and support information
4. **Contact Support**: Use trusted contact information if additional assistance is needed
            
## Technology Stack

### Frontend
- **React 19.1.0** - Modern JavaScript library for building user interfaces
- **React Router DOM 7.6.3** - Declarative routing for React applications
- **React Bootstrap 2.10.10** - Bootstrap components for React
- **Bootstrap 5.3.7** - CSS framework for responsive design
- **Vite 7.0.0** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 4.19.2** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose 8.16.1** - MongoDB object modeling library

### Authentication & Security
- **JSON Web Tokens 9.0.2** - Secure authentication mechanism
- **bcrypt 6.0.0** - Password hashing library
- **JWT Decode 4.0.0** - JWT token decoding utility
- **mongoose-field-encryption 7.0.1** - Field-level encryption for sensitive data in MongoDB

### Additional Libraries
- **QRCode 1.5.4** - QR code generation
- **@zxing/library 0.21.3** - QR code scanning functionality
- **libphonenumber-js 1.12.9** - Phone number validation and formatting
- **react-phone-number-input 3.4.12** - Phone number input component
- **Font Awesome 6.5.1** - Icon library via CDN
- **CORS 2.8.5** - Cross-origin resource sharing middleware

### Development Tools
- **ESLint** - Code linting and formatting
- **Concurrently** - Run multiple npm scripts simultaneously
- **Vite React Plugin** - React support for Vite

## API Documentation

### Authentication Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/update-username` - Update username
- `PUT /api/users/update-email` - Update email
- `PUT /api/users/change-password` - Change password
- `POST /api/users/request-password-reset` - Request password reset email
- `POST /api/users/reset-password` - Reset password using token
- `DELETE /api/users/delete-account` - Delete user account
- `POST /api/users/export-data` - Export user data (GDPR)
- `POST /api/users/start-parental-consent` - Start parental consent workflow (underage registration)
- `GET /api/users/consent` - Parental consent approval (tokenized link)
- `GET /api/users/consent/declined` - Parental consent declined (tokenized link)

### Passport Endpoints
- `GET /api/passport/generate-passcode` - Generate a new passcode
- `POST /api/passport/create` - Create or update communication passport
- `GET /api/passport/my-passport` - Get current user's passport
- `GET /api/passport/public/:passcode` - Retrieve passport by passcode (public)
- `DELETE /api/passport/delete` - Delete user's passport

## Contributing

We welcome contributions from the community! To get started:

1. Fork this repository
2. Create a new branch for your feature or fix (`git checkout -b feature/your-feature-name`)
3. Make your changes and commit them (`git commit -m 'Describe your change'`)
4. Push your branch to your fork (`git push origin feature/your-feature-name`)
5. Open a Pull Request describing your changes

### Contribution Guidelines
- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Update or add documentation as needed
- Be respectful and inclusive in all communications

If you have questions about environment variables or setup, please open an issue or reach out to [dljohnson1313@gmail.com]!

## Testing

### Manual Testing
The application includes comprehensive manual testing procedures for:
- User registration and authentication
- Passport creation and editing
- QR code generation and scanning
- Passcode lookup functionality
- Responsive design across devices

### Reporting Issues
If you experience any issues with the application, please:
1. Check existing issues on GitHub
2. Provide detailed steps to reproduce the problem
3. Include error messages and browser information
4. Contact [inquiries@get2knowme.co.uk](mailto:inquiries@get2knowme.co.uk) for urgent issues

## Credits

### Development Team

**Lead Developer**  
Devyn Johnson - Frontend/Backend Engineer
- [GitHub Profile](https://www.github.com/DevynJohnson)  
- [Portfolio](https://devynjohnson.me)  
- [LinkedIn](https://www.linkedin.com/in/devyn-johnson-a5259213b/)

**Contributor**  
Jake Barry - Conception, Content Creation
- [GitHub Profile](https://www.github.com/jakeb1991)  


### Acknowledgments

Special thanks to the neurodivergent community, healthcare professionals, and behavioral health experts for their insights and feedback during the development of this application.

### Third-Party Resources

#### Core Technologies
- [React](https://react.dev) - Component-based UI library
- [Vite](https://vite.dev) - Fast build tool and development server
- [Node.js](https://nodejs.org) - JavaScript runtime environment
- [Express.js](https://expressjs.com) - Web application framework
- [MongoDB](https://www.mongodb.com) - NoSQL database

#### UI/UX Libraries
- [Bootstrap](https://getbootstrap.com) - CSS framework
- [React Bootstrap](https://react-bootstrap.github.io) - Bootstrap components for React
- [Font Awesome](https://fontawesome.com) - Icon library

#### Utility Libraries
- [QRCode](https://www.npmjs.com/package/qrcode) - QR code generation
- [ZXing](https://github.com/zxing-js/library) - QR code scanning
- [libphonenumber-js](https://www.npmjs.com/package/libphonenumber-js) - Phone number utilities
- [React Router](https://reactrouter.com) - Client-side routing
- [Mongoose](https://mongoosejs.com) - MongoDB object modeling

#### Email & Transactional Messaging
- [Resend](https://resend.com/) - Transactional email delivery service (used for password reset and notifications)

#### Security & Authentication
- [JSON Web Tokens](https://jwt.io) - Secure token-based authentication
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing
- [mongoose-field-encryption](https://www.npmjs.com/package/mongoose-field-encryption) - Field-level encryption for sensitive data
- [CORS](https://www.npmjs.com/package/cors) - Cross-origin resource sharing

#### Development Tools
- [ESLint](https://eslint.org) - JavaScript linting
- [Concurrently](https://www.npmjs.com/package/concurrently) - Parallel script execution
- [Vite React Plugin](https://www.npmjs.com/package/@vitejs/plugin-react) - Vite plugin for React
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) - ESLint plugin for React hooks
- [eslint-plugin-react-refresh](https://www.npmjs.com/package/eslint-plugin-react-refresh) - ESLint plugin for React Fast Refresh
- [@types/react](https://www.npmjs.com/package/@types/react) - TypeScript type definitions for React
- [@types/react-dom](https://www.npmjs.com/package/@types/react-dom) - TypeScript type definitions for ReactDOM
- [globals](https://www.npmjs.com/package/globals) - List of global identifiers

#### Testing Tools
- [Jest](https://jestjs.io) - JavaScript testing framework
- [Supertest](https://www.npmjs.com/package/supertest) - HTTP assertions for integration testing
- [mongodb-memory-server](https://www.npmjs.com/package/mongodb-memory-server) - In-memory MongoDB server for testing
            
## GDPR & Privacy Compliance

Get2KnowMe is committed to protecting user privacy and complying with the General Data Protection Regulation (GDPR) and other relevant privacy laws. Key measures include:

- **Explicit Consent**: Users must provide explicit consent to the Terms of Service and Privacy Policy during registration, including age confirmation and agreement to data processing.
- **Right of Access & Deletion**: Users can access, export, or delete their data at any time via the application interface or by contacting support.
- **Data Minimization**: Only essential information is collected for account creation and communication passport functionality. No unnecessary or sensitive data is collected beyond what is required for the service.
- **Data Security**: Passwords are securely hashed (bcrypt). All data is encrypted in transit (HTTPS). Passport data is only visible when a user chooses to share their passcode or QR code.
- **Database Encryption**: Personally identifiable information (PII) is encrypted at the field level in MongoDB using [mongoose-field-encryption](https://www.npmjs.com/package/mongoose-field-encryption), ensuring sensitive data is protected at rest.
- **Children’s Privacy & Parental Consent**: The platform restricts use to those 16+ (or 13+ in the UK) unless verifiable parental consent is provided, in line with GDPR and UK GDPR requirements. For underage users, no personal data is stored until a parent or guardian provides explicit consent via a secure, tokenized email workflow. All pending registration data is encrypted at rest using field-level encryption. The parent receives a unique consent link, and only upon their approval is the child's account created and data stored. If consent is declined, all pending data is securely deleted. The consent request email and the registration interface both make it clear that sending the request to anyone other than a parent or guardian is a violation of the Terms of Service, and that accounts found to be created without proper consent will be immediately deactivated and all user data permanently deleted. This ensures full compliance with GDPR Article 8 and COPPA/UK GDPR standards for children’s data processing.
- **Data Hosting**: Data is stored securely using Render and MongoDB Atlas, both of which provide strong security and compliance features.
- **Breach Notification**: Users will be notified promptly in the event of a data breach affecting their personal data.
- **Third-Party Processors**: Only reputable, GDPR-compliant third-party services are used for hosting and infrastructure. No user data is sold or shared for marketing purposes.
- **Privacy Policy & Terms**: Full Privacy Policy and Terms of Service are available in the app and repository, outlining user rights and data practices.

For any privacy-related requests or questions, users can contact the team at [inquiries@get2knowme.co.uk].

---

## License
MIT License

Copyright (c) 2025 Devyn Johnson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

*Get2KnowMe - Empowering neurodivergent individuals through digital Communication Passports*
