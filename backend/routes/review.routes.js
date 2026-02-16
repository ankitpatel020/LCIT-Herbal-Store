import express from 'express';
import {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    markReviewHelpful,
    addAdminResponse,
    getAllReviews,
    approveReview,
    getTopReviews,
} from '../controllers/review.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/top', getTopReviews);
router.get('/product/:productId', getProductReviews);

// User routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/helpful', protect, markReviewHelpful);

// Admin routes
router.get('/', protect, authorize('admin'), getAllReviews);
router.put('/:id/response', protect, authorize('admin'), addAdminResponse);
router.put('/:id/approve', protect, authorize('admin'), approveReview);

export default router;
