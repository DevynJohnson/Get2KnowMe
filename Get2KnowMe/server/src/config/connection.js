import mongoose from 'mongoose';

// For Render deployment: 
// - Local .env uses test database URI in MONGO_DB_URI
// - Production Render environment sets MONGO_DB_URI to production database
const mongoURI = process.env.MONGO_DB_URI;

if (!mongoURI) {
    console.error('MongoDB URI is not defined in environment variables.')
    console.error('Please set MONGO_DB_URI in your .env file (development) or environment variables (production).')
    process.exit(1);
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoURI, {
        });
        const dbName = mongoose.connection.db.databaseName;
        const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
        console.log(`✅ Successfully connected to ${environment} database: ${dbName}`)
    } catch(error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
    };

export default connectToDatabase;