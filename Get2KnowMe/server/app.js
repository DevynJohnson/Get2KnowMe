import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './src/routes/user-routes.js';
import passportRoutes from './src/routes/passport-routes.js';
import storiesRoutes from './src/routes/stories.js';
import followRoutes from './src/routes/follow-routes.js';
import notificationRoutes from './src/routes/notification-routes.js';

// Define __filename and __dirname variables for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.CORS_ORIGIN
        ? [process.env.CORS_ORIGIN]
        : true
      : [
          'https://get2knowme.co.uk',
          'https://get2know.me',
          'https://get2knowme.onrender.com',
          'http://localhost:5173'
        ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  next();
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/passport', passportRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

export default app;
