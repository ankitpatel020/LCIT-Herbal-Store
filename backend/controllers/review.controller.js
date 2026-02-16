import Review from '../models/Review.js';
import Order from '../models/Order.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({
        product: req.params.productId,
        isApproved: true,
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('user', 'name avatar')
        .populate('adminResponse.respondedBy', 'name');

    const total = await Review.countDocuments({
        product: req.params.productId,
        isApproved: true,
    });

    res.status(200).json({
        success: true,
        count: reviews.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: reviews,
    });
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
    const { product, rating, comment, images } = req.body;

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
        user: req.user.id,
        product,
    });

    if (existingReview) {
        return res.status(400).json({
            success: false,
            message: 'You have already reviewed this product',
        });
    }

    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
        user: req.user.id,
        'orderItems.product': product,
        orderStatus: 'Delivered',
    });

    const review = await Review.create({
        user: req.user.id,
        product,
        rating,
        comment,
        images,
        isVerifiedPurchase: !!hasPurchased,
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: review,
    });
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req, res) => {
    let review = await Review.findById(req.params.id);

    if (!review) {
        return res.status(404).json({
            success: false,
            message: 'Review not found',
        });
    }

    // Make sure user owns this review
    if (review.user.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to update this review',
        });
    }

    const { rating, comment, images } = req.body;

    review = await Review.findByIdAndUpdate(
        req.params.id,
        { rating, comment, images },
        { new: true, runValidators: true }
    ).populate('user', 'name avatar');

    res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: review,
    });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return res.status(404).json({
            success: false,
            message: 'Review not found',
        });
    }

    // Make sure user owns this review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to delete this review',
        });
    }

    await review.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
    });
});

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
export const markReviewHelpful = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return res.status(404).json({
            success: false,
            message: 'Review not found',
        });
    }

    // Check if user has already marked this review as helpful
    if (review.helpfulBy.includes(req.user.id)) {
        // Remove from helpful
        review.helpfulBy = review.helpfulBy.filter(
            (id) => id.toString() !== req.user.id
        );
        review.helpfulCount -= 1;
    } else {
        // Add to helpful
        review.helpfulBy.push(req.user.id);
        review.helpfulCount += 1;
    }

    await review.save();

    res.status(200).json({
        success: true,
        data: review,
    });
});

// @desc    Admin response to review
// @route   PUT /api/reviews/:id/response
// @access  Private/Admin
export const addAdminResponse = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return res.status(404).json({
            success: false,
            message: 'Review not found',
        });
    }

    review.adminResponse = {
        comment: req.body.comment,
        respondedBy: req.user.id,
        respondedAt: Date.now(),
    };

    await review.save();
    await review.populate('adminResponse.respondedBy', 'name');

    res.status(200).json({
        success: true,
        message: 'Response added successfully',
        data: review,
    });
});

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.query.isApproved) {
        query.isApproved = req.query.isApproved === 'true';
    }

    const reviews = await Review.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('user', 'name email avatar')
        .populate('product', 'name images');

    const total = await Review.countDocuments(query);

    res.status(200).json({
        success: true,
        count: reviews.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: reviews,
    });
});

// @desc    Approve/Reject review
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
export const approveReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return res.status(404).json({
            success: false,
            message: 'Review not found',
        });
    }

    review.isApproved = req.body.isApproved;
    await review.save();

    res.status(200).json({
        success: true,
        message: `Review ${req.body.isApproved ? 'approved' : 'rejected'} successfully`,
        data: review,
    });
});

// @desc    Get top rated reviews (5 stars)
// @route   GET /api/reviews/top
// @access  Public
export const getTopReviews = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 6;

    const reviews = await Review.find({
        rating: 5,
        isApproved: true,
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user', 'name avatar')
        .populate('product', 'name images');

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews,
    });
});
