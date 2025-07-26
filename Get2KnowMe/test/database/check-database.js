import mongoose from 'mongoose';

async function simpleCheck() {
  try {
    const baseConnectionString = process.env.MONGO_DB_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;
    console.log('🔍 Connection string:', baseConnectionString.replace(/:([^:@]{3})[^:@]*@/, ':***@'));

    // Connect to default database
    console.log('\n=== CHECKING DEFAULT DATABASE ===');
    const defaultConnection = await mongoose.connect(baseConnectionString);
    console.log('✓ Connected to MongoDB Atlas');
    
    // List all collections in default database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Collections in default database:', collections.map(c => c.name));
    
    // Check users collection
    if (collections.some(c => c.name === 'users')) {
      const userCount = await mongoose.connection.db.collection('users').countDocuments();
      console.log(`👥 Users in default database: ${userCount}`);
      
      if (userCount > 0) {
        const sampleUsers = await mongoose.connection.db.collection('users').find({}).limit(3).toArray();
        console.log('📋 Sample users:');
        sampleUsers.forEach(user => {
          console.log(`  - ${user.email || user.username || user._id}`);
        });
      }
    } else {
      console.log('❌ No users collection found in default database');
    }

    await mongoose.disconnect();

    // Now check Get2KnowMe database specifically
    console.log('\n=== CHECKING Get2KnowMe DATABASE ===');
    const get2knowmeConnectionString = baseConnectionString + '/Get2KnowMe';
    
    await mongoose.connect(get2knowmeConnectionString);
    console.log('✓ Connected to Get2KnowMe database');
    
    const get2knowmeCollections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Collections in Get2KnowMe database:', get2knowmeCollections.map(c => c.name));
    
    if (get2knowmeCollections.some(c => c.name === 'users')) {
      const userCount = await mongoose.connection.db.collection('users').countDocuments();
      console.log(`👥 Users in Get2KnowMe database: ${userCount}`);
      
      if (userCount > 0) {
        const sampleUsers = await mongoose.connection.db.collection('users').find({}).limit(3).toArray();
        console.log('📋 Sample users:');
        sampleUsers.forEach(user => {
          console.log(`  - ${user.email || user.username || user._id}`);
        });
      }
    } else {
      console.log('❌ No users collection found in Get2KnowMe database');
    }

    await mongoose.disconnect();

    // List all databases
    console.log('\n=== LISTING ALL DATABASES ===');
    const adminConnection = await mongoose.connect(baseConnectionString);
    const admin = mongoose.connection.db.admin();
    const databasesList = await admin.listDatabases();
    
    console.log('🗄️  All databases in your MongoDB Atlas cluster:');
    for (const db of databasesList.databases) {
      console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    }

    await mongoose.disconnect();

    console.log('\n=== NEXT STEPS ===');
    console.log('1. If users are found in the default database, your migration script had the wrong source');
    console.log('2. If users are in Get2KnowMe, the migration worked but your app is looking in the wrong place');
    console.log('3. If no users are found anywhere, check MongoDB Atlas backups immediately');

  } catch (error) {
    console.error('❌ Check failed:', error.message);
    console.error('Full error:', error);
  }
}

simpleCheck();