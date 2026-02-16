import Coupon from "../models/Coupon.js";
import User from "../models/User.js";

/* =====================================================
   CREATE COUPON (Admin)
===================================================== */
export const createCoupon = async (req, res) => {
    try {
        const {
            code,
            description,
            discountType,
            discountValue,
            maxDiscountAmount,
            minOrderAmount,
            applicableFor,
            requiresStudentVerification,
            allowedDepartments,
            allowedYears,
            usageLimit,
            perUserLimit,
            startDate,
            expiryDate,
            applicableProducts,
            applicableCategories,
        } = req.body;

        if (!code || !description || !discountValue || !expiryDate) {
            return res.status(400).json({
                success: false,
                message: "Code, description, discount value and expiry date are required",
            });
        }

        const existingCoupon = await Coupon.findOne({
            code: code.toUpperCase(),
        });

        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists",
            });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            description,
            discountType,
            discountValue,
            maxDiscountAmount,
            minOrderAmount,
            applicableFor,
            requiresStudentVerification,
            allowedDepartments,
            allowedYears,
            usageLimit,
            perUserLimit,
            startDate: startDate ? new Date(startDate) : undefined,
            expiryDate: new Date(expiryDate),
            applicableProducts,
            applicableCategories,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            data: coupon,
        });

    } catch (error) {

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        console.error("❌ Error creating coupon:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* =====================================================
   GET ALL COUPONS (Admin)
===================================================== */
export const getAllCoupons = async (req, res) => {
    try {
        const { isActive, applicableFor } = req.query;

        const filter = {};

        if (isActive !== undefined) {
            filter.isActive = isActive === "true";
        }

        if (applicableFor) {
            filter.applicableFor = applicableFor;
        }

        const coupons = await Coupon.find(filter)
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: coupons.length,
            data: coupons,
        });

    } catch (error) {
        console.error("❌ Error fetching coupons:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* =====================================================
   GET AVAILABLE COUPONS (User)
===================================================== */
export const getAvailableCoupons = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        const now = new Date();

        const coupons = await Coupon.find({
            isActive: true,
            startDate: { $lte: now },
            expiryDate: { $gte: now },
        });

        const eligibleCoupons = coupons.filter((coupon) => {
            if (!coupon.isValid()) return false;
            if (!coupon.canUserUse(userId)) return false;

            if (
                coupon.requiresStudentVerification &&
                (!user.isLCITStudent ||
                    user.studentVerificationStatus !== "verified")
            ) {
                return false;
            }

            if (
                coupon.allowedDepartments.length > 0 &&
                !coupon.allowedDepartments.includes(user.department)
            ) {
                return false;
            }

            if (
                coupon.allowedYears.length > 0 &&
                !coupon.allowedYears.includes(user.yearOfStudy)
            ) {
                return false;
            }

            return true;
        });

        res.status(200).json({
            success: true,
            count: eligibleCoupons.length,
            data: eligibleCoupons,
        });

    } catch (error) {
        console.error("❌ Error fetching available coupons:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* =====================================================
   VALIDATE COUPON
===================================================== */
export const validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        const userId = req.user._id;

        if (!code || !orderAmount) {
            return res.status(400).json({
                success: false,
                message: "Coupon code and order amount are required",
            });
        }

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Invalid coupon code",
            });
        }

        if (!coupon.isValid()) {
            return res.status(400).json({
                success: false,
                message: "Coupon is expired or inactive",
            });
        }

        if (!coupon.canUserUse(userId)) {
            return res.status(400).json({
                success: false,
                message: "You have reached usage limit for this coupon",
            });
        }

        const numericAmount = Number(orderAmount);

        if (numericAmount < coupon.minOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
            });
        }

        const discountAmount = coupon.calculateDiscount(numericAmount);
        const finalAmount = numericAmount - discountAmount;

        res.status(200).json({
            success: true,
            message: "Coupon applied successfully",
            data: {
                couponId: coupon._id,
                code: coupon.code,
                discountAmount,
                originalAmount: numericAmount,
                finalAmount,
            },
        });

    } catch (error) {
        console.error("❌ Error validating coupon:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* =====================================================
   UPDATE COUPON (Admin)
===================================================== */
export const updateCoupon = async (req, res) => {
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                startDate: req.body.startDate
                    ? new Date(req.body.startDate)
                    : undefined,
                expiryDate: req.body.expiryDate
                    ? new Date(req.body.expiryDate)
                    : undefined,
            },
            { new: true, runValidators: true }
        );

        if (!updatedCoupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            data: updatedCoupon,
        });

    } catch (error) {

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* =====================================================
   DELETE COUPON (Admin)
===================================================== */
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        await coupon.deleteOne();

        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully",
        });

    } catch (error) {
        console.error("❌ Error deleting coupon:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* =====================================================
   TOGGLE STATUS (Admin)
===================================================== */
export const toggleCouponStatus = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        res.status(200).json({
            success: true,
            message: `Coupon ${coupon.isActive ? "activated" : "deactivated"} successfully`,
            data: coupon,
        });

    } catch (error) {
        console.error("❌ Error toggling coupon:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* =====================================================
   GET COUPON STATS (Admin)
===================================================== */
export const getCouponStats = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id).populate("usedBy.user", "name email");

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        const stats = {
            code: coupon.code,
            totalUsage: coupon.usageCount,
            uniqueUsers: coupon.usedBy.length,
            usageLimit: coupon.usageLimit || "Unlimited",
            remainingUses: coupon.usageLimit ? coupon.usageLimit - coupon.usageCount : "Unlimited",
            isActive: coupon.isActive,
            isValid: coupon.isValid(),
            recentUsers: coupon.usedBy.slice(-10).reverse(),
        };

        res.status(200).json({
            success: true,
            data: stats,
        });

    } catch (error) {
        console.error("❌ Error fetching coupon stats:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
