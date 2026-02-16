import express from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    getFeaturedProducts,
    getLowStockProducts,
    getOutOfStockProducts,
    uploadProductImages,
    deleteProductImage,
} from '../controllers/product.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/categories/list', getCategories);
router.get('/featured/list', getFeaturedProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.get('/lowstock/list', protect, authorize('admin'), getLowStockProducts);
router.get(
    '/outofstock/list',
    protect,
    authorize('admin'),
    getOutOfStockProducts
);

// Product image upload routes (admin only)
router.post(
    '/:id/images',
    protect,
    authorize('admin'),
    uploadMultiple,
    uploadProductImages
);
router.delete(
    '/:id/images/:imageId',
    protect,
    authorize('admin'),
    deleteProductImage
);

export default router;
