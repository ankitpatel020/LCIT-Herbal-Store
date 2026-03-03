/**
 * Admin Registration Script
 * Run with: node adminRegister.js
 * Requires ADMIN_EMAIL and ADMIN_PASSWORD in your .env file
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function run() {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in your .env file.');
        process.exit(1);
    }

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI is not defined in .env');

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('✅ Connected. DB:', mongoose.connection.db.databaseName);

        const db = mongoose.connection.db;
        const users = db.collection('users');

        // Check if admin email already exists
        const existingAdmin = await users.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log(`\n⚠️  User with email ${ADMIN_EMAIL} already exists in the database.`);
            console.log('Cannot register fresh admin. If you need to reset the password, use the forgot password flow.');
        } else {
            console.log(`\nCreating fresh admin account for: ${ADMIN_EMAIL}...`);
            const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

            const result = await users.insertOne({
                name: 'Admin',
                email: ADMIN_EMAIL,
                password: hashed,
                role: 'admin',
                isActive: true,
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log('✅ Admin successfully created with id:', result.insertedId);

            console.log('\n🔑 Login credentials:');
            console.log('   Email   :', ADMIN_EMAIL);
            console.log('   Password:', ADMIN_PASSWORD);
            console.log('');
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

run();
