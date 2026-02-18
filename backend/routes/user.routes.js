import express from 'express';
import {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    updateUserAvatar,
    deleteUserAvatar,
    submitStudentVerification,
    approveStudentVerification,
    rejectStudentVerification,
    getPendingStudentVerifications,
    updateStudentProfile,
    withdrawVerification,
    deactivateAccount,
    deleteMyAccount,
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';

const router = express.Router();

// Avatar upload routes (authenticated users only)
router.put('/avatar', protect, uploadAvatar, updateUserAvatar);
router.delete('/avatar', protect, deleteUserAvatar);

// Student verification routes
router.post('/verify-student', protect, submitStudentVerification);
router.put('/verify-student/withdraw', protect, withdrawVerification);
router.put('/student-profile', protect, updateStudentProfile);
router.put('/profile/deactivate', protect, deactivateAccount);
router.delete('/profile', protect, deleteMyAccount);

// All user management routes are admin-only
router.use(protect, authorize('admin'));

router.get('/pending-students', getPendingStudentVerifications);

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/toggle-status', toggleUserStatus);

router.put('/:id/approve-student', approveStudentVerification);
router.put('/:id/reject-student', rejectStudentVerification);

export default router;
