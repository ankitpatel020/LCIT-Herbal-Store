import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: { type: String, required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true },
                image: { type: String },
            },
        ],
        shippingAddress: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            country: { type: String, default: 'India' },
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ['COD', 'Card', 'UPI', 'Razorpay', 'Stripe'],
            default: 'COD',
        },
        paymentInfo: {
            id: String,
            status: String,
            paidAt: Date,
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        discountAmount: {
            type: Number,
            default: 0.0,
        },
        couponApplied: {
            coupon: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Coupon',
            },
            code: String,
            discountValue: Number,
            discountType: String,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        orderStatus: {
            type: String,
            enum: ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
            default: 'Pending',
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
        trackingNumber: {
            type: String,
        },
        statusHistory: [
            {
                status: String,
                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                comment: String,
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        notes: {
            type: String,
            maxlength: [500, 'Notes cannot exceed 500 characters'],
        },
        cancelReason: {
            type: String,
        },
        returnReason: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Add status to history when order status changes
orderSchema.pre('save', function (next) {
    if (this.isModified('orderStatus')) {
        this.statusHistory.push({
            status: this.orderStatus,
            timestamp: new Date(),
        });
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
