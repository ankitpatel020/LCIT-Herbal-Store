import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api";

/* =====================================================
   INITIAL STATE
===================================================== */
const initialState = {
    coupons: [],
    appliedCoupon: null,

    validateStatus: "idle",
    listStatus: "idle",
    createStatus: "idle",
    updateStatus: "idle",
    deleteStatus: "idle",

    error: null,
    message: null,
};

/* =====================================================
   HELPER - GET AUTH HEADER
===================================================== */
const getAuthHeader = (thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

/* =====================================================
   VALIDATE COUPON
===================================================== */
export const validateCoupon = createAsyncThunk(
    "coupons/validate",
    async ({ code, orderAmount }, thunkAPI) => {
        try {
            const response = await axios.post(
                `${API_URL}/coupons/validate`,
                { code, orderAmount },
                getAuthHeader(thunkAPI)
            );

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to validate coupon"
            );
        }
    }
);

/* =====================================================
   GET ALL COUPONS (ADMIN)
===================================================== */
export const getAllCoupons = createAsyncThunk(
    "coupons/getAll",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(
                `${API_URL}/coupons`,
                getAuthHeader(thunkAPI)
            );

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch coupons"
            );
        }
    }
);

/* =====================================================
   CREATE COUPON
===================================================== */
export const createCoupon = createAsyncThunk(
    "coupons/create",
    async (couponData, thunkAPI) => {
        try {
            const response = await axios.post(
                `${API_URL}/coupons`,
                couponData,
                getAuthHeader(thunkAPI)
            );

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to create coupon"
            );
        }
    }
);

/* =====================================================
   UPDATE COUPON
===================================================== */
export const updateCoupon = createAsyncThunk(
    "coupons/update",
    async ({ id, couponData }, thunkAPI) => {
        try {
            const response = await axios.put(
                `${API_URL}/coupons/${id}`,
                couponData,
                getAuthHeader(thunkAPI)
            );

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to update coupon"
            );
        }
    }
);

/* =====================================================
   DELETE COUPON
===================================================== */
export const deleteCoupon = createAsyncThunk(
    "coupons/delete",
    async (id, thunkAPI) => {
        try {
            await axios.delete(
                `${API_URL}/coupons/${id}`,
                getAuthHeader(thunkAPI)
            );

            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to delete coupon"
            );
        }
    }
);

/* =====================================================
   SLICE
===================================================== */
const couponSlice = createSlice({
    name: "coupons",
    initialState,
    reducers: {
        clearCouponState: (state) => {
            state.error = null;
            state.message = null;
        },
        removeAppliedCoupon: (state) => {
            state.appliedCoupon = null;
        },
    },
    extraReducers: (builder) => {
        builder

            /* ===== VALIDATE ===== */
            .addCase(validateCoupon.pending, (state) => {
                state.validateStatus = "loading";
                state.error = null;
            })
            .addCase(validateCoupon.fulfilled, (state, action) => {
                state.validateStatus = "success";
                state.appliedCoupon = action.payload?.data || action.payload;
            })
            .addCase(validateCoupon.rejected, (state, action) => {
                state.validateStatus = "error";
                state.error = action.payload;
            })

            /* ===== GET ALL ===== */
            .addCase(getAllCoupons.pending, (state) => {
                state.listStatus = "loading";
                state.error = null;
            })
            .addCase(getAllCoupons.fulfilled, (state, action) => {
                state.listStatus = "success";
                state.coupons = action.payload?.data || [];
            })
            .addCase(getAllCoupons.rejected, (state, action) => {
                state.listStatus = "error";
                state.error = action.payload;
            })

            /* ===== CREATE ===== */
            .addCase(createCoupon.pending, (state) => {
                state.createStatus = "loading";
                state.error = null;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.createStatus = "success";
                const newCoupon = action.payload?.data;
                if (newCoupon) state.coupons.unshift(newCoupon);
                state.message = action.payload?.message || "Coupon created";
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.createStatus = "error";
                state.error = action.payload;
            })

            /* ===== UPDATE ===== */
            .addCase(updateCoupon.pending, (state) => {
                state.updateStatus = "loading";
                state.error = null;
            })
            .addCase(updateCoupon.fulfilled, (state, action) => {
                state.updateStatus = "success";
                const updated = action.payload?.data;
                if (updated) {
                    state.coupons = state.coupons.map((coupon) =>
                        coupon._id === updated._id ? updated : coupon
                    );
                }
                state.message = action.payload?.message || "Coupon updated";
            })
            .addCase(updateCoupon.rejected, (state, action) => {
                state.updateStatus = "error";
                state.error = action.payload;
            })

            /* ===== DELETE ===== */
            .addCase(deleteCoupon.pending, (state) => {
                state.deleteStatus = "loading";
                state.error = null;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.deleteStatus = "success";
                state.coupons = state.coupons.filter(
                    (coupon) => coupon._id !== action.payload
                );
                state.message = "Coupon deleted successfully";
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.deleteStatus = "error";
                state.error = action.payload;
            });
    },
});

export const { clearCouponState, removeAppliedCoupon } =
    couponSlice.actions;

export default couponSlice.reducer;
