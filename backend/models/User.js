import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return password by default
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'agent'],
            default: 'user',
        },
        phone: {
            type: String,
            trim: true,
            match: [/^\+?[0-9]{10,13}$/, 'Please provide a valid phone number (e.g., 7000172431 or +917000172431)'],
        },
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            pincode: { type: String, trim: true },
            country: { type: String, default: 'India' },
        },
        avatar: {
            type: String,
            default: 'https://ui-avatars.com/api/?name=User&background=random',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // LCIT Student Verification
        isLCITStudent: {
            type: Boolean,
            default: false,
        },
        studentId: {
            type: String,
            trim: true,
            uppercase: true,
            sparse: true, // Allows null values but ensures uniqueness when present
        },
        department: {
            type: String,
            trim: true,
            default: '',
        },
        yearOfStudy: {
            type: Number,
        },
        studentVerificationStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected', 'not-applicable'],
            default: 'not-applicable',
        },
        // LCIT Faculty Verification
        isLCITFaculty: {
            type: Boolean,
            default: false,
        },
        employeeId: {
            type: String,
            trim: true,
            uppercase: true,
        },
        facultyDepartment: {
            type: String,
            trim: true,
        },
        designation: {
            type: String,
            trim: true,
        },
        facultyVerificationStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected', 'not-applicable'],
            default: 'not-applicable',
        },
        facultyIdProof: {
            type: String,
        },
        studentIdProof: {
            type: String, // URL to uploaded student ID card
        },
        studentVerifiedAt: {
            type: Date,
        },
        studentVerifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        verificationToken: String,
        verificationTokenExpire: Date,
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
