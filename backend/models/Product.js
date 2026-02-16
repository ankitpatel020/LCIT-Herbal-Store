import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide product name'],
            trim: true,
            maxlength: [100, 'Product name cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide product description'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide product price'],
            min: [0, 'Price cannot be negative'],
        },
        originalPrice: {
            type: Number,
            min: [0, 'Original price cannot be negative'],
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative'],
            max: [100, 'Discount cannot exceed 100%'],
        },
        studentDiscount: {
            type: Number,
            default: 25,
            min: [0, 'Student discount cannot be negative'],
            max: [100, 'Student discount cannot exceed 100%'],
        },
        facultyDiscount: {
            type: Number,
            default: 50,
            min: [0, 'Faculty discount cannot be negative'],
            max: [100, 'Faculty discount cannot exceed 100%'],
        },
        category: {
            type: String,
            required: [true, 'Please select product category'],
            enum: [
                'Herbal Soaps',
                'Natural Oils',
                'Ayurvedic Powders',
                'Face Packs',
                'Plant Medicines',
                'Hair Care',
                'Skin Care',
                'Wellness',
                'Other',
            ],
        },
        stock: {
            type: Number,
            required: [true, 'Please provide stock quantity'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        images: [
            {
                public_id: String,
                url: String,
            },
        ],
        benefits: [
            {
                type: String,
                trim: true,
            },
        ],
        ingredients: [
            {
                name: { type: String, trim: true },
                percentage: { type: String, trim: true },
            },
        ],
        usage: {
            type: String,
            maxlength: [1000, 'Usage instructions cannot exceed 1000 characters'],
        },
        certifications: [
            {
                name: { type: String, trim: true },
                certificateUrl: { type: String },
            },
        ],
        isLabTested: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        ratings: {
            average: {
                type: Number,
                default: 0,
                min: [0, 'Rating cannot be less than 0'],
                max: [5, 'Rating cannot be more than 5'],
            },
            count: {
                type: Number,
                default: 0,
            },
        },
        views: {
            type: Number,
            default: 0,
        },
        soldCount: {
            type: Number,
            default: 0,
        },
        lowStockAlert: {
            type: Number,
            default: 10,
        },
        weight: {
            value: { type: Number },
            unit: { type: String, enum: ['g', 'kg', 'ml', 'l'], default: 'g' },
        },
        expiryMonths: {
            type: Number,
            default: 24,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Index for search optimization
productSchema.index({ name: 'text', description: 'text', category: 'text' });

// Virtual for checking if stock is low
productSchema.virtual('isLowStock').get(function () {
    return this.stock <= this.lowStockAlert && this.stock > 0;
});

// Virtual for checking if out of stock
productSchema.virtual('isOutOfStock').get(function () {
    return this.stock === 0;
});

// Calculate discount price
productSchema.virtual('discountedPrice').get(function () {
    if (this.discount > 0) {
        return this.price - (this.price * this.discount) / 100;
    }
    return this.price;
});

// Calculate student price
productSchema.virtual('studentPrice').get(function () {
    const discount = this.studentDiscount || 25; // Default 25% if not set (though schema default covers it)
    return this.price - (this.price * discount) / 100;
});

// Calculate faculty price
productSchema.virtual('facultyPrice').get(function () {
    const discount = this.facultyDiscount || 50; // Default 50%
    return this.price - (this.price * discount) / 100;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
