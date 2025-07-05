import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectToDatabase from './src/config/connection.js'; // Import the connection function
import userRoutes from './src/routes/user-routes.js';
import passportRoutes from './src/routes/passport-routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Define __filename and __dirname variables as they no longer have built-in definitions
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB using the method defined at server/src/config/connection.js
connectToDatabase();

// Add some debugging for environment
console.log('Environment:', process.env.NODE_ENV);
console.log('PORT:', PORT);
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for both development and production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : true)
    : ["https://get2knowme.co.uk", "https://get2know.me", "https://get2knowme.onrender.com"],
  credentials: true,
};
console.log('CORS Options:', corsOptions);
app.use(cors(corsOptions));

// Define API routes
app.use('/api/users', userRoutes);
app.use('/api/passport', passportRoutes);

// Serve static frontend files for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));  // Serving the 'dist' folder
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../dist", "index.html"));
  });
}

// Start server and log the current port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
