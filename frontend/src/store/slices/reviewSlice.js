import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const initialState = {
    reviews: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// Get reviews for a product
export const getProductReviews = createAsyncThunk(
    'reviews/getProductReviews',
    async (productId, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/reviews/product/${productId}`);
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch reviews';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create review
export const createReview = createAsyncThunk(
    'reviews/create',
    async (reviewData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.post(`${API_URL}/reviews`, reviewData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to create review';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get all reviews (Admin)
export const getAllReviews = createAsyncThunk(
    'reviews/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.get(`${API_URL}/reviews`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch reviews';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete review
export const deleteReview = createAsyncThunk(
    'reviews/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            await axios.delete(`${API_URL}/reviews/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete review';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Approve/Reject review
export const approveReview = createAsyncThunk(
    'reviews/approve',
    async ({ id, isApproved }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.put(
                `${API_URL}/reviews/${id}/approve`,
                { isApproved },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update review status';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get top reviews
export const getTopReviews = createAsyncThunk(
    'reviews/getTop',
    async (limit, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/reviews/top${limit ? `?limit=${limit}` : ''}`);
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch reviews';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // Get product reviews
            .addCase(getProductReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProductReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.reviews = action.payload.data;
            })
            .addCase(getProductReviews.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get top reviews
            .addCase(getTopReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTopReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.reviews = action.payload.data;
            })
            .addCase(getTopReviews.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Create review
            .addCase(createReview.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.reviews.push(action.payload.data);
                state.message = 'Review submitted successfully';
            })
            .addCase(createReview.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get all reviews
            .addCase(getAllReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.reviews = action.payload.data;
            })
            .addCase(getAllReviews.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete review
            .addCase(deleteReview.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.reviews = state.reviews.filter((review) => review._id !== action.payload);
                state.message = 'Review deleted successfully';
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Approve review
            .addCase(approveReview.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(approveReview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Update review in list
                state.reviews = state.reviews.map((review) =>
                    review._id === action.payload.data._id ? action.payload.data : review
                );
                state.message = action.payload.message;
            })
            .addCase(approveReview.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = reviewSlice.actions;
export default reviewSlice.reducer;
