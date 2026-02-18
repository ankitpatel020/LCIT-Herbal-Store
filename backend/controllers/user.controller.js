import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
    uploadToCloudinary,
    deleteFromCloudinary,
} from './upload.controller.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by role
    if (req.query.role) {
        query.role = req.query.role;
    }

    // Filter by active status
    if (req.query.isActive) {
        query.isActive = req.query.isActive === 'true';
    }

    // Search by name or email
    if (req.query.search) {
        query.$or = [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
        ];
    }

    const users = await User.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .select('-password');

    const total = await User.countDocuments(query);

    res.status(200).json({
        success: true,
        count: users.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: users,
    });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    const { name, email, role, isActive, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, role, isActive, phone, address },
        { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
    });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
        return res.status(400).json({
            success: false,
            message: 'Cannot delete admin users',
        });
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });
});

// @desc    Toggle user active status
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Admin
export const toggleUserStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
        data: user,
    });
});

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
export const updateUserAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Please upload an avatar image',
        });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    try {
        // Delete old avatar from Cloudinary if it exists and is not the default
        if (
            user.avatar &&
            !user.avatar.includes('background=random') &&
            user.avatar.includes('cloudinary')
        ) {
            // Extract public_id from the URL
            const urlParts = user.avatar.split('/');
            const publicIdWithExt = urlParts.slice(-2).join('/');
            const public_id = publicIdWithExt.split('.')[0];
            await deleteFromCloudinary(public_id);
        }

        // Upload new avatar to Cloudinary
        const result = await uploadToCloudinary(
            req.file.buffer,
            'lcit-herbal-store/avatars'
        );

        // Update user avatar
        user.avatar = result.secure_url;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Avatar updated successfully',
            data: {
                avatar: user.avatar,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading avatar',
            error: error.message,
        });
    }
});

// @desc    Delete user avatar (reset to default)
// @route   DELETE /api/users/avatar
// @access  Private
export const deleteUserAvatar = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    try {
        // Delete avatar from Cloudinary if it exists and is not the default
        if (
            user.avatar &&
            !user.avatar.includes('background=random') &&
            user.avatar.includes('cloudinary')
        ) {
            const urlParts = user.avatar.split('/');
            const publicIdWithExt = urlParts.slice(-2).join('/');
            const public_id = publicIdWithExt.split('.')[0];
            await deleteFromCloudinary(public_id);
        }

        // Reset to default avatar
        user.avatar =
            'https://ui-avatars.com/api/?name=User&background=random';
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Avatar deleted successfully',
            data: {
                avatar: user.avatar,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting avatar',
            error: error.message,
        });
    }
});


// @desc    Submit student/faculty verification request
// @route   POST /api/users/verify-student
// @access  Private
export const submitStudentVerification = asyncHandler(async (req, res) => {
    const { studentId, department, yearOfStudy, studentIdProof, isFaculty } = req.body;
    const userId = req.user._id;

    if (!studentId || !department || !yearOfStudy) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields',
        });
    }

    if (isFaculty) {
        // Faculty Logic
        const existingFaculty = await User.findOne({
            employeeId: studentId.toUpperCase(),
            _id: { $ne: userId }
        });

        if (existingFaculty) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID already registered',
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                employeeId: studentId.toUpperCase(),
                facultyDepartment: department,
                designation: yearOfStudy, // Mapping designation from frontend
                facultyIdProof: studentIdProof,
                facultyVerificationStatus: 'pending',
            },
            { new: true, runValidators: true }
        ).select('-password');

        return res.status(200).json({
            success: true,
            message: 'Faculty verification request submitted successfully',
            data: user,
        });

    } else {
        // Student Logic
        const existingStudent = await User.findOne({
            studentId: studentId.toUpperCase(),
            _id: { $ne: userId }
        });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Student ID already registered',
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                studentId: studentId.toUpperCase(),
                department,
                yearOfStudy,
                studentIdProof,
                studentVerificationStatus: 'pending',
            },
            { new: true, runValidators: true }
        ).select('-password');

        return res.status(200).json({
            success: true,
            message: 'Student verification request submitted successfully',
            data: user,
        });
    }
});


// @desc    Approve student/faculty verification (Admin only)
// @route   PUT /api/users/:id/approve-student
// @access  Private/Admin
export const approveStudentVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    if (user.studentVerificationStatus === 'pending') {
        user.isLCITStudent = true;
        user.studentVerificationStatus = 'verified';
        user.studentVerifiedAt = new Date();
        user.studentVerifiedBy = req.user._id;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Student verification approved successfully',
            data: user,
        });
    }

    if (user.facultyVerificationStatus === 'pending') {
        user.isLCITFaculty = true;
        user.facultyVerificationStatus = 'verified';
        // user.facultyVerifiedAt = new Date(); // Schema update needed if tracked
        // user.facultyVerifiedBy = req.user._id;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Faculty verification approved successfully',
            data: user,
        });
    }

    return res.status(400).json({
        success: false,
        message: 'No pending verification request',
    });
});

// @desc    Reject student/faculty verification (Admin only)
// @route   PUT /api/users/:id/reject-student
// @access  Private/Admin
export const rejectStudentVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    const { reason } = req.body;

    if (user.studentVerificationStatus === 'pending') {
        user.studentVerificationStatus = 'rejected';
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Student verification rejected',
            data: user,
            reason,
        });
    }

    if (user.facultyVerificationStatus === 'pending') {
        user.facultyVerificationStatus = 'rejected';
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Faculty verification rejected',
            data: user,
            reason,
        });
    }

    return res.status(400).json({
        success: false,
        message: 'No pending verification request',
    });
});

// @desc    Get pending verifications (Student & Faculty) (Admin only)
// @route   GET /api/users/pending-students
// @access  Private/Admin
export const getPendingStudentVerifications = asyncHandler(async (req, res) => {
    const pendingVerifications = await User.find({
        $or: [
            { studentVerificationStatus: 'pending' },
            { facultyVerificationStatus: 'pending' }
        ]
    })
        .select('-password')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: pendingVerifications.length,
        data: pendingVerifications,
    });
});

// @desc    Update student profile
// @route   PUT /api/users/student-profile
// @access  Private
export const updateStudentProfile = asyncHandler(async (req, res) => {
    const { department, yearOfStudy } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user.isLCITStudent) {
        return res.status(403).json({
            success: false,
            message: 'Only verified students can update student profile',
        });
    }

    if (department) user.department = department;
    if (yearOfStudy) user.yearOfStudy = yearOfStudy;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Student profile updated successfully',
        data: user,
    });
});


// @desc    Withdraw student/faculty verification request
// @route   PUT /api/users/verify-student/withdraw
// @access  Private
export const withdrawVerification = asyncHandler(async (req, res) => {
    const { type } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (type === 'faculty') {
        if (user.facultyVerificationStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'No pending faculty verification request to withdraw',
            });
        }
        user.facultyVerificationStatus = 'not-applicable';
        user.facultyIdProof = undefined; // Optional: clear proof

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Faculty verification request withdrawn',
            data: user,
        });
    }

    if (type === 'student') {
        if (user.studentVerificationStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'No pending student verification request to withdraw',
            });
        }
        user.studentVerificationStatus = 'not-applicable';
        user.studentIdProof = undefined; // Optional: clear proof

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Student verification request withdrawn',
            data: user,
        });
    }

    // Fallback if no type provided (for backward compatibility)
    if (user.studentVerificationStatus === 'pending') {
        user.studentVerificationStatus = 'not-applicable';
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Verification request withdrawn',
            data: user,
        });
    } else if (user.facultyVerificationStatus === 'pending') {
        user.facultyVerificationStatus = 'not-applicable';
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Verification request withdrawn',
            data: user,
        });
    }

    return res.status(400).json({
        success: false,
        message: 'No pending verification request to withdraw',
    });
});

// @desc    Deactivate user account
// @route   PUT /api/users/profile/deactivate
// @access  Private
export const deactivateAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Account deactivated successfully',
    });
});

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteMyAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Account deleted successfully',
    });
});
