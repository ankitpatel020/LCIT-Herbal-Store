import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please provide a rating'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        comment: {
            type: String,
            required: [true, 'Please provide a review comment'],
            maxlength: [500, 'Review cannot exceed 500 characters'],
        },
        images: [
            {
                public_id: String,
                url: String,
            },
        ],
        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },
        helpfulCount: {
            type: Number,
            default: 0,
        },
        helpfulBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        isApproved: {
            type: Boolean,
            default: true,
        },
        adminResponse: {
            comment: String,
            respondedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            respondedAt: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate reviews from same user for same product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product ratings when review is saved
reviewSchema.post('save', async function () {
    const Review = this.constructor;
    const Product = mongoose.model('Product');

    const stats = await Review.aggregate([
        {
            $match: { product: this.product, isApproved: true },
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(this.product, {
            'ratings.average': Math.round(stats[0].averageRating * 10) / 10,
            'ratings.count': stats[0].reviewCount,
        });
    }
});

// Update product ratings when review is deleted
reviewSchema.post('remove', async function () {
    const Review = this.constructor;
    const Product = mongoose.model('Product');

    const stats = await Review.aggregate([
        {
            $match: { product: this.product, isApproved: true },
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(this.product, {
            'ratings.average': Math.round(stats[0].averageRating * 10) / 10,
            'ratings.count': stats[0].reviewCount,
        });
    } else {
        await Product.findByIdAndUpdate(this.product, {
            'ratings.average': 0,
            'ratings.count': 0,
        });
    }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
