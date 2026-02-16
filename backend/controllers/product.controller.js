import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
    uploadToCloudinary,
    deleteFromCloudinary,
} from './upload.controller.js';

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isActive: true };

    // Filter by category
    if (req.query.category && req.query.category !== 'all') {
        query.category = req.query.category;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Filter by rating
    if (req.query.minRating) {
        query['ratings.average'] = { $gte: Number(req.query.minRating) };
    }

    // Filter by stock status
    if (req.query.inStock === 'true') {
        query.stock = { $gt: 0 };
    }

    // Filter by featured
    if (req.query.featured === 'true') {
        query.isFeatured = true;
    }

    // Search functionality
    if (req.query.search) {
        query.$text = { $search: req.query.search };
    }

    // Sorting
    let sortBy = {};
    if (req.query.sort) {
        switch (req.query.sort) {
            case 'price-low':
                sortBy = { price: 1 };
                break;
            case 'price-high':
                sortBy = { price: -1 };
                break;
            case 'rating':
                sortBy = { 'ratings.average': -1 };
                break;
            case 'newest':
                sortBy = { createdAt: -1 };
                break;
            case 'popular':
                sortBy = { soldCount: -1 };
                break;
            default:
                sortBy = { createdAt: -1 };
        }
    } else {
        sortBy = { createdAt: -1 };
    }

    // Execute query
    const products = await Product.find(query)
        .sort(sortBy)
        .limit(limit)
        .skip(skip)
        .populate('createdBy', 'name');

    const total = await Product.countDocuments(query);

    res.status(200).json({
        success: true,
        count: products.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: products,
    });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
        'createdBy',
        'name email'
    );

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.status(200).json({
        success: true,
        data: product,
    });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    req.body.createdBy = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
    });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product,
    });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
    });
});

// @desc    Get product categories
// @route   GET /api/products/categories/list
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Product.distinct('category');

    res.status(200).json({
        success: true,
        data: categories,
    });
});

// @desc    Get featured products
// @route   GET /api/products/featured/list
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ isFeatured: true, isActive: true })
        .limit(8)
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: products.length,
        data: products,
    });
});

// @desc    Get low stock products
// @route   GET /api/products/lowstock/list
// @access  Private/Admin
export const getLowStockProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({
        $expr: { $lte: ['$stock', '$lowStockAlert'] },
        stock: { $gt: 0 },
    }).sort({ stock: 1 });

    res.status(200).json({
        success: true,
        count: products.length,
        data: products,
    });
});

// @desc    Get out of stock products
// @route   GET /api/products/outofstock/list
// @access  Private/Admin
export const getOutOfStockProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ stock: 0 }).sort({ updatedAt: -1 });

    res.status(200).json({
        success: true,
        count: products.length,
        data: products,
    });
});

// @desc    Upload product images
// @route   POST /api/products/:id/images
// @access  Private/Admin
export const uploadProductImages = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Please upload at least one image',
        });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }

    try {
        // Upload images to Cloudinary
        const uploadPromises = req.files.map((file) =>
            uploadToCloudinary(file.buffer, 'lcit-herbal-store/products')
        );

        const results = await Promise.all(uploadPromises);

        // Add new images to product
        const newImages = results.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));

        product.images.push(...newImages);
        await product.save();

        res.status(200).json({
            success: true,
            message: `${newImages.length} image(s) uploaded successfully`,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading product images',
            error: error.message,
        });
    }
});

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private/Admin
export const deleteProductImage = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }

    const imageIndex = product.images.findIndex(
        (img) => img._id.toString() === req.params.imageId
    );

    if (imageIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Image not found',
        });
    }

    try {
        // Delete from Cloudinary
        const image = product.images[imageIndex];
        if (image.public_id) {
            await deleteFromCloudinary(image.public_id);
        }

        // Remove from product
        product.images.splice(imageIndex, 1);
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product image',
            error: error.message,
        });
    }
});

