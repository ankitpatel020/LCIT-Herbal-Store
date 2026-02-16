import { instance } from '../server.js';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Checkout and create Razorpay order
// @route   POST /api/payment/checkout
// @access  Private
export const checkout = asyncHandler(async (req, res) => {
    const options = {
        amount: Number(req.body.amount * 100), // amount in the smallest currency unit
        currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
        success: true,
        order,
    });
});

// @desc    Verify payment
// @route   POST /api/payment/verification
// @access  Private
export const paymentVerification = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Find the order and update it
        // Note: order_id here is our database Order ID, not Razorpay's
        // We need to pass it from frontend

        // Save payment details
        // We can create a Payment model or just update Order
        // Let's just update Order for simplicity as per common simple ecommerce patterns,
        // unless a Payment model is strictly required. 
        // The import { Payment } from '../models/Payment.js'; suggests a model might be expected, 
        // but looking at existing `Order` model, it has `paymentInfo`.

        const order = await Order.findById(order_id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentInfo = {
                id: razorpay_payment_id,
                status: 'succeeded'
            };
            await order.save();
        }

        res.status(200).json({
            success: true,
            // payment_id: razorpay_payment_id,
        });
    } else {
        res.status(400).json({
            success: false,
        });
    }
});

// @desc    Get Razorpay Key
// @route   GET /api/payment/getkey
// @access  Private
export const getRazorpayKey = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID
    });
});
