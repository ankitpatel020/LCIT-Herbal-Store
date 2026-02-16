import express from 'express';
import {
    getDashboardStats,
    getSalesAnalytics,
    getTopProducts,
    getCategorySales,
    getOrderStatusDistribution,
    getRevenueAnalytics,
    getUserAnalytics,
    getRecentActivities,
} from '../controllers/analytics.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All analytics routes are admin-only
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/sales', getSalesAnalytics);
router.get('/top-products', getTopProducts);
router.get('/category-sales', getCategorySales);
router.get('/order-status', getOrderStatusDistribution);
router.get('/revenue', getRevenueAnalytics);
router.get('/users', getUserAnalytics);
router.get('/recent-activities', getRecentActivities);

export default router;
