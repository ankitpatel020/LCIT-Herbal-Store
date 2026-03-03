/**
 * Admin Seeder / Reset Script
 * Run with: node adminRegister.js
 * Requires:
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 *   MONGODB_URI
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !MONGODB_URI) {
        console.error('❌ Missing required environment variables.');
        console.error('Required: ADMIN_EMAIL, ADMIN_PASSWORD, MONGODB_URI');
        process.exit(1);
    }

    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            autoIndex: true,
        });

        console.log('✅ Connected to DB:', mongoose.connection.db.databaseName);

        const db = mongoose.connection.db;
        const users = db.collection('users');

        // Ensure unique email index
        await users.createIndex({ email: 1 }, { unique: true });

        const existingAdmin = await users.findOne({ email: ADMIN_EMAIL });

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

        if (existingAdmin) {
            console.log(`\n⚠️ Admin already exists. Resetting password...`);

            await users.updateOne(
                { email: ADMIN_EMAIL },
                {
                    $set: {
                        password: hashedPassword,
                        role: 'admin',
                        isActive: true,
                        isVerified: true,
                        updatedAt: new Date(),
                    },
                }
            );

            console.log('✅ Admin password reset successful.');
        } else {
            console.log(`\n🆕 Creating fresh admin account for ${ADMIN_EMAIL}...`);

            const result = await users.insertOne({
                name: 'Super Admin',
                email: ADMIN_EMAIL,
                password: hashedPassword,
                role: 'admin',
                isActive: true,
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            console.log('✅ Admin created successfully.');
            console.log('🆔 ID:', result.insertedId.toString());
        }

        console.log('\n🎉 Admin setup completed successfully.');

    } catch (error) {
        if (error.code === 11000) {
            console.error('❌ Duplicate email detected.');
        } else {
            console.error('❌ Error:', error.message);
        }
    } finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB disconnected.');
        process.exit(0);
    }
}

run();