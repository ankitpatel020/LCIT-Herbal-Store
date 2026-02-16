import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    deleteOrder,
    getInvoice
} from '../controllers/order.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/:id/invoice', protect, getInvoice);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/cancel', protect, cancelOrder);

// Admin/Agent routes
router.get('/', protect, authorize('admin', 'agent'), getAllOrders);
router.put('/:id/status', protect, authorize('admin', 'agent'), updateOrderStatus);
router.delete('/:id', protect, authorize('admin'), deleteOrder);

export default router;
