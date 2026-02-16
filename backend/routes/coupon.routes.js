import express from "express";
import {
    createCoupon,
    getAllCoupons,
    getAvailableCoupons,
    validateCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    getCouponStats,
} from "../controllers/coupon.controller.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

/* =====================================================
   USER ROUTES
===================================================== */

// Validate coupon
router.post("/validate", protect, validateCoupon);

// Get available coupons for logged-in user
router.get("/available", protect, getAvailableCoupons);


/* =====================================================
   ADMIN ROUTES
===================================================== */

// Create coupon
router.post("/", protect, authorize("admin"), createCoupon);

// Get all coupons
router.get("/", protect, authorize("admin"), getAllCoupons);

// Get coupon stats
router.get("/:id/stats", protect, authorize("admin"), getCouponStats);

// Update coupon
router.put("/:id", protect, authorize("admin"), updateCoupon);

// Toggle active/inactive
router.patch("/:id/toggle", protect, authorize("admin"), toggleCouponStatus);

// Delete coupon
router.delete("/:id", protect, authorize("admin"), deleteCoupon);

export default router;
