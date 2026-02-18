import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api';

const initialState = {
    orders: [],
    order: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// Create order
export const createOrder = createAsyncThunk(
    'orders/create',
    async (orderData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.post(`${API_URL}/orders`, orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to create order';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get my orders
export const getMyOrders = createAsyncThunk(
    'orders/getMyOrders',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.get(`${API_URL}/orders/myorders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch orders';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get order by ID
export const getOrderById = createAsyncThunk(
    'orders/getById',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.get(`${API_URL}/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch order';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get Invoice
export const getInvoice = createAsyncThunk(
    'orders/getInvoice',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.get(`${API_URL}/orders/${id}/invoice`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch invoice';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
    'orders/cancel',
    async ({ id, reason }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.put(
                `${API_URL}/orders/${id}/cancel`,
                { reason },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to cancel order';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get all orders (Admin/Agent)
export const getAllOrders = createAsyncThunk(
    'orders/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.get(`${API_URL}/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch all orders';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update order status (Admin/Agent)
export const updateOrderStatus = createAsyncThunk(
    'orders/updateStatus',
    async ({ id, status }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.put(
                `${API_URL}/orders/${id}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update order status';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete order (Admin)
export const deleteOrder = createAsyncThunk(
    'orders/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            await axios.delete(`${API_URL}/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete order';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        clearOrder: (state) => {
            state.order = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get my orders
            .addCase(getMyOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.orders = action.payload.data;
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get order by ID
            .addCase(getOrderById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload.data;
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Invoice
            .addCase(getInvoice.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getInvoice.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload.data;
            })
            .addCase(getInvoice.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Cancel order
            .addCase(cancelOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get all orders
            .addCase(getAllOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.orders = action.payload.data;
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update order status
            .addCase(updateOrderStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload.data;
                // Update in list
                state.orders = state.orders.map((order) =>
                    order._id === action.payload.data._id ? action.payload.data : order
                );
                state.message = 'Order status updated successfully';
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete order
            .addCase(deleteOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.orders = state.orders.filter((order) => order._id !== action.payload);
                state.message = 'Order deleted successfully';
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
