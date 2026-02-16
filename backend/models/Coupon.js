import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Please provide a coupon code"],
            unique: true,
            uppercase: true,
            trim: true,
            maxlength: [20, "Coupon code cannot exceed 20 characters"],
        },

        description: {
            type: String,
            required: [true, "Please provide a description"],
            maxlength: [200, "Description cannot exceed 200 characters"],
        },

        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
            default: "percentage",
        },

        discountValue: {
            type: Number,
            required: [true, "Please provide a discount value"],
            min: [0, "Discount value cannot be negative"],
        },

        maxDiscountAmount: {
            type: Number,
            default: null,
        },

        minOrderAmount: {
            type: Number,
            default: 0,
            min: [0, "Minimum order amount cannot be negative"],
        },

        applicableFor: {
            type: String,
            enum: ["all", "lcit-students", "first-time", "specific-users"],
            default: "all",
        },

        requiresStudentVerification: {
            type: Boolean,
            default: false,
        },

        allowedDepartments: {
            type: [String],
            default: [],
        },

        allowedYears: {
            type: [Number],
            default: [],
        },

        usageLimit: {
            type: Number,
            default: null,
        },

        usageCount: {
            type: Number,
            default: 0,
        },

        perUserLimit: {
            type: Number,
            default: 1,
        },

        usedBy: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                usedCount: {
                    type: Number,
                    default: 1,
                },
                lastUsedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        startDate: {
            type: Date,
            required: true,
            default: Date.now,
        },

        expiryDate: {
            type: Date,
            required: [true, "Please provide an expiry date"],
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        applicableProducts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],

        applicableCategories: {
            type: [String],
            default: [],
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

/* ================================
   INDEXES
================================ */
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ applicableFor: 1 });

/* ================================
   VALIDATION: Expiry > Start
================================ */
couponSchema.pre("validate", function (next) {
    if (this.expiryDate && this.startDate && this.expiryDate <= this.startDate) {
        this.invalidate(
            "expiryDate",
            "Expiry date must be after start date"
        );
    }
    next();
});

/* ================================
   METHOD: Check if coupon valid
================================ */
couponSchema.methods.isValid = function () {
    const now = new Date();

    const expiry = new Date(this.expiryDate);
    expiry.setHours(23, 59, 59, 999);

    return (
        this.isActive &&
        now >= this.startDate &&
        now <= expiry &&
        (this.usageLimit === null || this.usageCount < this.usageLimit)
    );
};

/* ================================
   METHOD: Per-user usage
================================ */
couponSchema.methods.canUserUse = function (userId) {
    const usage = this.usedBy.find(
        (u) => u.user.toString() === userId.toString()
    );

    if (!usage) return true;

    return usage.usedCount < this.perUserLimit;
};

/* ================================
   METHOD: Calculate discount
================================ */
couponSchema.methods.calculateDiscount = function (orderAmount) {
    if (!this.isValid()) return 0;
    if (orderAmount < this.minOrderAmount) return 0;

    let discount = 0;

    if (this.discountType === "percentage") {
        discount = (orderAmount * this.discountValue) / 100;

        if (
            this.maxDiscountAmount &&
            discount > this.maxDiscountAmount
        ) {
            discount = this.maxDiscountAmount;
        }
    } else {
        discount = this.discountValue;
    }

    return Math.min(discount, orderAmount);
};

export default mongoose.model("Coupon", couponSchema);
