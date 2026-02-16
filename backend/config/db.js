import mongoose from 'mongoose';

const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);
      return;
    } catch (error) {
      console.error(`❌ Error connecting to MongoDB: ${error.message}`);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (retries === 0) {
        console.error('❌ Could not connect to MongoDB after retries. Exiting...');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB connection error: ${err}`);
});

export default connectDB;
