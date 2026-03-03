import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const NEW_PASSWORD = process.env.ADMIN_PASSWORD;
const MONGODB_URI = process.env.MONGODB_URI;

async function resetAdmin() {
    if (!ADMIN_EMAIL || !NEW_PASSWORD || !MONGODB_URI) {
        console.error('❌ Missing required environment variables.');
        console.error('Required: ADMIN_EMAIL, ADMIN_PASSWORD, MONGODB_URI');
        process.exit(1);
    }

    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const user = await User.findOne({ email: ADMIN_EMAIL }).select('+password');

        if (!user) {
            console.log(`❌ No admin found with email: ${ADMIN_EMAIL}`);
            process.exit(1);
        }

        if (user.role !== 'admin') {
            console.log('❌ User found but is not an admin.');
            process.exit(1);
        }

        // This will trigger pre-save hook for hashing
        user.password = NEW_PASSWORD;
        user.updatedAt = new Date();
        await user.save();

        console.log('');
        console.log('✅ Admin password reset successfully.');
        console.log('📧 Email:', user.email);
        console.log('🔐 Use the password defined in your .env file.');
        console.log('');

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB disconnected.');
        process.exit(0);
    }
}

resetAdmin();