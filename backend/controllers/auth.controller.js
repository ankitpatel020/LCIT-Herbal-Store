import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendTokenResponse } from '../middleware/auth.js';
import crypto from 'crypto';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({
            success: false,
            message: 'User already exists with this email',
        });
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        phone,
        address,
    });

    // Send token response
    sendTokenResponse(user, 201, res, 'User registered successfully');
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password',
        });
    }

    // Check for user (include password for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }

    // Check if user is active
    if (!user.isActive) {
        return res.status(401).json({
            success: false,
            message: 'Your account has been deactivated. Please contact support.',
        });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }

    // Send token response
    sendTokenResponse(user, 200, res, 'Login successful');
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = asyncHandler(async (req, res) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
    });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
        return res.status(401).json({
            success: false,
            message: 'Current password is incorrect',
        });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password updated successfully');
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'No user found with this email',
        });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // TODO: Send email with reset URL
    // For now, just return the token (in production, send via email)

    res.status(200).json({
        success: true,
        message: 'Password reset link sent to email',
        resetToken, // Remove this in production
        resetUrl, // Remove this in production
    });
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired reset token',
        });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successful');
});
