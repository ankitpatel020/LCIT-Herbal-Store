import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
    // Total sales
    const totalSalesData = await Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalSales = totalSalesData[0]?.total || 0;

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total products
    const totalProducts = await Product.countDocuments();

    // Total users
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Pending orders
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

    // Low stock products
    const lowStockProducts = await Product.countDocuments({
        $expr: { $lte: ['$stock', '$lowStockAlert'] },
        stock: { $gt: 0 },
    });

    // Out of stock products
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    // Recent orders (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentOrders = await Order.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });

    // Sales this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlySalesData = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfMonth },
                orderStatus: { $ne: 'Cancelled' },
            },
        },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const monthlySales = monthlySalesData[0]?.total || 0;

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    res.status(200).json({
        success: true,
        data: {
            totalSales: Math.round(totalSales * 100) / 100,
            totalOrders,
            totalProducts,
            totalUsers,
            pendingOrders,
            lowStockProducts,
            outOfStockProducts,
            recentOrders,
            monthlySales: Math.round(monthlySales * 100) / 100,
            avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        },
    });
});

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
export const getSalesAnalytics = asyncHandler(async (req, res) => {
    const { period = 'month' } = req.query;

    let groupBy;
    let dateRange;

    switch (period) {
        case 'week':
            dateRange = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            groupBy = {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            };
            break;
        case 'month':
            dateRange = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            groupBy = {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            };
            break;
        case 'year':
            dateRange = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
            groupBy = {
                $dateToString: { format: '%Y-%m', date: '$createdAt' },
            };
            break;
        default:
            dateRange = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            groupBy = {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            };
    }

    const salesData = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: dateRange },
                orderStatus: { $ne: 'Cancelled' },
            },
        },
        {
            $group: {
                _id: groupBy,
                totalSales: { $sum: '$totalPrice' },
                orderCount: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
        success: true,
        period,
        data: salesData,
    });
});

// @desc    Get top selling products
// @route   GET /api/analytics/top-products
// @access  Private/Admin
export const getTopProducts = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    const topProducts = await Product.find({ soldCount: { $gt: 0 } })
        .sort({ soldCount: -1 })
        .limit(limit)
        .select('name soldCount price images category');

    res.status(200).json({
        success: true,
        count: topProducts.length,
        data: topProducts,
    });
});

// @desc    Get category-wise sales
// @route   GET /api/analytics/category-sales
// @access  Private/Admin
export const getCategorySales = asyncHandler(async (req, res) => {
    const categorySales = await Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $unwind: '$orderItems' },
        {
            $lookup: {
                from: 'products',
                localField: 'orderItems.product',
                foreignField: '_id',
                as: 'productInfo',
            },
        },
        { $unwind: '$productInfo' },
        {
            $group: {
                _id: '$productInfo.category',
                totalSales: {
                    $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] },
                },
                totalQuantity: { $sum: '$orderItems.quantity' },
            },
        },
        { $sort: { totalSales: -1 } },
    ]);

    res.status(200).json({
        success: true,
        data: categorySales,
    });
});

// @desc    Get order status distribution
// @route   GET /api/analytics/order-status
// @access  Private/Admin
export const getOrderStatusDistribution = asyncHandler(async (req, res) => {
    const statusDistribution = await Order.aggregate([
        {
            $group: {
                _id: '$orderStatus',
                count: { $sum: 1 },
            },
        },
    ]);

    res.status(200).json({
        success: true,
        data: statusDistribution,
    });
});

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private/Admin
export const getRevenueAnalytics = asyncHandler(async (req, res) => {
    const revenueData = await Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$totalPrice' },
                totalItemsPrice: { $sum: '$itemsPrice' },
                totalShipping: { $sum: '$shippingPrice' },
                totalTax: { $sum: '$taxPrice' },
                orderCount: { $sum: 1 },
            },
        },
    ]);

    const data = revenueData[0] || {
        totalRevenue: 0,
        totalItemsPrice: 0,
        totalShipping: 0,
        totalTax: 0,
        orderCount: 0,
    };

    res.status(200).json({
        success: true,
        data: {
            ...data,
            avgOrderValue: data.orderCount > 0 ? data.totalRevenue / data.orderCount : 0,
        },
    });
});

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private/Admin
export const getUserAnalytics = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', isActive: true });
    const verifiedUsers = await User.countDocuments({
        role: 'user',
        isVerified: true,
    });

    // New users this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newUsersThisMonth = await User.countDocuments({
        role: 'user',
        createdAt: { $gte: startOfMonth },
    });

    // Users with orders
    const usersWithOrders = await Order.distinct('user');

    res.status(200).json({
        success: true,
        data: {
            totalUsers,
            activeUsers,
            verifiedUsers,
            newUsersThisMonth,
            usersWithOrders: usersWithOrders.length,
            conversionRate:
                totalUsers > 0
                    ? Math.round((usersWithOrders.length / totalUsers) * 100 * 100) / 100
                    : 0,
        },
    });
});

// @desc    Get recent activities
// @route   GET /api/analytics/recent-activities
// @access  Private/Admin
export const getRecentActivities = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    // Recent orders
    const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user', 'name email')
        .select('orderStatus totalPrice createdAt');

    // Recent reviews
    const recentReviews = await Review.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user', 'name')
        .populate('product', 'name')
        .select('rating comment createdAt');

    // Recent users
    const recentUsers = await User.find({ role: 'user' })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('name email createdAt');

    res.status(200).json({
        success: true,
        data: {
            recentOrders,
            recentReviews,
            recentUsers,
        },
    });
});
