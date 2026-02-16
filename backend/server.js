import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import dns from 'node:dns';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Force DNS to prefer IPv4 (fixes ENETUNREACH issues in some environments)
dns.setDefaultResultOrder('ipv4first');

// Import routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import reviewRoutes from './routes/review.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import userRoutes from './routes/user.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import Razorpay from 'razorpay';


// Load env vars
dotenv.config();

// Connect to database
connectDB();

export let instance;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
} else {
    console.warn("⚠️  Razorpay credentials not found. Payment features will be disabled.");
    instance = {
        orders: {
            create: () => Promise.reject(new Error("Razorpay not configured")),
        },
    };
}

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser middleware
app.use(cookieParser());

// Logging middleware
// Logging middleware
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'LCIT Herbal Store API is running',
        timestamp: new Date().toISOString(),
    });
});

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: '🌿 Welcome to LCIT Herbal Store API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            orders: '/api/orders',
            reviews: '/api/reviews',
            analytics: '/api/analytics',
            users: '/api/users',
            coupons: '/api/coupons',
            health: '/api/health',
        },
    });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('🌿 ═══════════════════════════════════════════════════════');
    console.log('🌿  LCIT Herbal Store - Department of Chemistry');
    console.log('🌿 ═══════════════════════════════════════════════════════');
    console.log(`🚀  Server running in ${process.env.NODE_ENV} mode`);
    console.log(`🌐  Server URL: http://localhost:${PORT}`);
    console.log(`📡  API Base: http://localhost:${PORT}/api`);
    console.log(`💚  Health Check: http://localhost:${PORT}/api/health`);
    console.log('🌿 ═══════════════════════════════════════════════════════');
    console.log('');
});

// Handle unhandled promise rejections
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', err);
    console.error(`❌ Error Message: ${err ? err.message : 'No message'}`);
    console.error(`❌ Stack Trace: ${err ? err.stack : 'No stack'}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});

export default app;
