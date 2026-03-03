/**
 * Admin Diagnostic + Fix Script
 * Run with: node adminFix.js
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const NEW_PASSWORD = 'Admin@1234';
const ADMIN_EMAIL = 'admin@lcit.ac.in';

async function run() {
    try {
        const uri = process.env.MONGODB_URI;
        console.log('🔌 Connecting to:', uri);

        await mongoose.connect(uri);
        console.log('✅ Connected. DB:', mongoose.connection.db.databaseName);

        const db = mongoose.connection.db;
        const users = db.collection('users');

        // List ALL users
        const allUsers = await users.find({}, { projection: { name: 1, email: 1, role: 1, isActive: 1 } }).toArray();
        console.log('\n📋 All users in DB:');
        allUsers.forEach(u => console.log(`  - ${u.email}  role:${u.role}  active:${u.isActive}`));

        // Find admin by email
        let admin = await users.findOne({ email: ADMIN_EMAIL });

        if (!admin) {
            console.log('\n⚠️  Admin not found by email. Creating fresh admin...');
            const hashed = await bcrypt.hash(NEW_PASSWORD, 10);
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
            console.log('✅ Admin created with id:', result.insertedId);
        } else {
            console.log('\n✅ Found admin:', admin.email, '| isActive:', admin.isActive);
            // Reset password + ensure active
            const hashed = await bcrypt.hash(NEW_PASSWORD, 10);
            await users.updateOne(
                { _id: admin._id },
                { $set: { password: hashed, isActive: true } }
            );
            console.log('✅ Password reset & account activated');
        }

        console.log('\n🔑 Login credentials:');
        console.log('   Email   :', ADMIN_EMAIL);
        console.log('   Password:', NEW_PASSWORD);
        console.log('');

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

run();
