import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getIO } from '../config/socket.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        couponCode,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No order items provided',
        });
    }

    let discountAmount = 0;
    let couponApplied = null;

    // Handle coupon if provided
    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

        if (!coupon || !coupon.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired coupon',
            });
        }

        if (!coupon.canUserUse(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: 'You have already used this coupon maximum times',
            });
        }

        // Calculate discount
        discountAmount = coupon.calculateDiscount(itemsPrice);

        // Update coupon usage
        const userUsage = coupon.usedBy.find(
            (usage) => usage.user.toString() === req.user.id.toString()
        );

        if (userUsage) {
            userUsage.usedCount += 1;
            userUsage.lastUsedAt = new Date();
        } else {
            coupon.usedBy.push({
                user: req.user.id,
                usedCount: 1,
                lastUsedAt: new Date(),
            });
        }

        coupon.usageCount += 1;
        await coupon.save();

        couponApplied = {
            coupon: coupon._id,
            code: coupon.code,
            discountValue: coupon.discountValue,
            discountType: coupon.discountType,
        };
    }

    // Verify stock availability and update stock
    for (const item of orderItems) {
        const product = await Product.findById(item.product);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Product not found: ${item.name}`,
            });
        }

        if (product.stock < item.quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
            });
        }
    }

    const finalCalculatedTotal = itemsPrice + taxPrice + shippingPrice - discountAmount;

    const order = await Order.create({
        user: req.user.id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountAmount,
        couponApplied,
        totalPrice: finalCalculatedTotal,
    });

    // Update product stock and sold count
    for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity, soldCount: item.quantity },
        });
    }

    // Emit new order event to admin and agent rooms
    try {
        const io = getIO();
        io.to('admin_room').emit('newOrder', {
            orderId: order._id,
            totalPrice: order.totalPrice,
            message: `New order #${order._id.toString().substring(0, 8)} placed!`,
        });
    } catch (err) {
        console.error('Socket error emitting newOrder:', err);
    }

    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order,
    });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .populate('orderItems.product', 'name images');

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
    });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email phone')
        .populate('orderItems.product', 'name images');

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found',
        });
    }

    // Make sure user owns this order or is admin/agent
    if (
        order.user._id.toString() !== req.user.id &&
        req.user.role !== 'admin' &&
        req.user.role !== 'agent'
    ) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to view this order',
        });
    }

    res.status(200).json({
        success: true,
        data: order,
    });
});

// @desc    Get order invoice
// @route   GET /api/orders/:id/invoice
// @access  Private
export const getInvoice = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email phone')
        .populate('orderItems.product', 'name images price originalPrice regularPrice hsnCode sacCode');

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found',
        });
    }

    // Make sure user owns this order or is admin/agent
    if (
        order.user._id.toString() !== req.user.id &&
        req.user.role !== 'admin' &&
        req.user.role !== 'agent'
    ) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to view this invoice',
        });
    }

    if (!order.isDelivered) {
        return res.status(400).json({
            success: false,
            message: 'Invoice is only available after delivery',
        });
    }

    res.status(200).json({
        success: true,
        data: order,
    });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found',
        });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentInfo = {
        id: req.body.id,
        status: req.body.status,
        paidAt: Date.now(),
    };

    const updatedOrder = await order.save();

    // Emit event to user
    try {
        const io = getIO();
        io.to(`user_${order.user.toString()}`).emit('orderStatusUpdated', {
            orderId: order._id,
            status: 'Paid',
            message: `Your order #${order._id.toString().substring(0, 8)} has been marked as paid.`,
        });
    } catch (err) {
        console.error('Socket error emitting orderStatusUpdated:', err);
    }

    res.status(200).json({
        success: true,
        message: 'Order marked as paid',
        data: updatedOrder,
    });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin/Agent
export const getAllOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (req.query.status) {
        query.orderStatus = req.query.status;
    }

    // Filter by payment status
    if (req.query.isPaid) {
        query.isPaid = req.query.isPaid === 'true';
    }

    // Filter by delivery status
    if (req.query.isDelivered) {
        query.isDelivered = req.query.isDelivered === 'true';
    }

    const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('user', 'name email phone')
        .populate('orderItems.product', 'name');

    const total = await Order.countDocuments(query);

    res.status(200).json({
        success: true,
        count: orders.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: orders,
    });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Agent
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found',
        });
    }

    const { status, comment, trackingNumber } = req.body;

    order.orderStatus = status;

    if (trackingNumber) {
        order.trackingNumber = trackingNumber;
    }

    if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        // Calculate Agent Commission if the user is an agent
        if (req.user.role === 'agent') {
            // Assign the agent to the order if not already assigned
            if (!order.agent) {
                order.agent = req.user._id;
            }
            // Use the agent's specific commission rate or fallback to default
            const commissionRate = req.user.commissionRate || 0.1;
            order.agentCommission = order.totalPrice * commissionRate;
            order.commissionStatus = 'pending';
        }
    }

    // Add to status history
    order.statusHistory.push({
        status,
        updatedBy: req.user.id,
        comment,
        timestamp: Date.now(),
    });

    const updatedOrder = await order.save();

    // Emit event to user
    try {
        const io = getIO();
        io.to(`user_${order.user.toString()}`).emit('orderStatusUpdated', {
            orderId: order._id,
            status: updatedOrder.orderStatus,
            message: `Your order #${order._id.toString().substring(0, 8)} status is now: ${updatedOrder.orderStatus}`,
        });
    } catch (err) {
        console.error('Socket error emitting orderStatusUpdated:', err);
    }

    res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder,
    });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found',
        });
    }

    // Check if user owns this order or is admin/agent
    if (
        order.user.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin' &&
        req.user.role !== 'agent'
    ) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to cancel this order',
        });
    }

    // Can only cancel if order is pending or processing
    if (!['Pending', 'Processing'].includes(order.orderStatus)) {
        return res.status(400).json({
            success: false,
            message: 'Cannot cancel order in current status',
        });
    }

    order.orderStatus = 'Cancelled';
    order.cancelReason = req.body.reason;

    // Restore product stock
    for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity, soldCount: -item.quantity },
        });
    }

    // Refund coupon usages if an active coupon was tied to the order
    if (order.couponApplied && order.couponApplied.coupon) {
        const couponToRefund = await Coupon.findById(order.couponApplied.coupon);
        if (couponToRefund) {
            const userUsage = couponToRefund.usedBy.find(
                (u) => u.user.toString() === order.user.toString()
            );

            if (userUsage && userUsage.usedCount > 0) {
                userUsage.usedCount -= 1;
            }

            if (couponToRefund.usageCount > 0) {
                couponToRefund.usageCount -= 1;
            }

            await couponToRefund.save();
        }
    }

    const updatedOrder = await order.save();

    // Emit event to user
    try {
        const io = getIO();
        io.to(`user_${order.user.toString()}`).emit('orderStatusUpdated', {
            orderId: order._id,
            status: 'Cancelled',
            message: `Your order #${order._id.toString().substring(0, 8)} has been cancelled.`,
        });
    } catch (err) {
        console.error('Socket error emitting orderStatusUpdated:', err);
    }

    res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: updatedOrder,
    });
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found',
        });
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
    });
});

// @desc    Update order payment status (Admin/Agent)
// @route   PUT /api/orders/:id/payment-status
// @access  Private/Admin/Agent
export const updatePaymentStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found',
        });
    }

    const { isPaid, paymentMethod, paymentId, paymentStatus } = req.body;

    if (typeof isPaid !== 'undefined') {
        order.isPaid = isPaid;
        if (isPaid && !order.paidAt) {
            order.paidAt = Date.now();
        } else if (!isPaid) {
            order.paidAt = undefined;
        }
    }

    if (paymentMethod) {
        order.paymentMethod = paymentMethod;
    }

    if (paymentId || paymentStatus) {
        order.paymentInfo = {
            id: paymentId || order.paymentInfo?.id,
            status: paymentStatus || order.paymentInfo?.status,
            paidAt: order.isPaid ? (order.paymentInfo?.paidAt || Date.now()) : undefined
        };
    }

    const updatedOrder = await order.save();

    res.status(200).json({
        success: true,
        message: 'Order payment status updated successfully',
        data: updatedOrder,
    });
});
