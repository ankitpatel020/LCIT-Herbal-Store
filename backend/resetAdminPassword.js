import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const NEW_PASSWORD = 'Admin@1234';

async function resetAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const user = await User.findOne({ role: 'admin' }).select('+password');

        if (!user) {
            console.log('❌ No admin user found in the database.');
            process.exit(1);
        }

        // Set the password – the pre-save hook will hash it automatically
        user.password = NEW_PASSWORD;
        await user.save();

        console.log('');
        console.log('✅ Admin password reset successfully!');
        console.log('   Email   :', user.email);
        console.log('   Password:', NEW_PASSWORD);
        console.log('');
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

resetAdmin();
