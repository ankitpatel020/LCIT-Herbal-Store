import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const initialState = {
    stats: null,
    salesData: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// Get dashboard stats
export const getDashboardStats = createAsyncThunk(
    'analytics/getDashboardStats',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.get(`${API_URL}/analytics/dashboard`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch dashboard stats';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const analyticsSlice = createSlice({
    name: 'analytics',
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
            .addCase(getDashboardStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.stats = action.payload.data;
            })
            .addCase(getDashboardStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = analyticsSlice.actions;
export default analyticsSlice.reducer;
