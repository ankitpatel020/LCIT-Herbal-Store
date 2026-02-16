import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const initialState = {
    products: [],
    product: null,
    categories: [],
    featuredProducts: [],
    total: 0,
    page: 1,
    pages: 1,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// Get all products
export const getProducts = createAsyncThunk(
    'products/getAll',
    async (params, thunkAPI) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await axios.get(`${API_URL}/products?${queryString}`);
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch products';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get single product
export const getProduct = createAsyncThunk(
    'products/getOne',
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/products/${id}`);
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch product';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get categories
export const getCategories = createAsyncThunk(
    'products/getCategories',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/products/categories/list`);
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch categories';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get featured products
export const getFeaturedProducts = createAsyncThunk(
    'products/getFeatured',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/products/featured/list`);
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch featured products';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create product
export const createProduct = createAsyncThunk(
    'products/create',
    async (productData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(`${API_URL}/products`, productData, config);
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to create product';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update product
export const updateProduct = createAsyncThunk(
    'products/update',
    async ({ id, productData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(`${API_URL}/products/${id}`, productData, config);
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to update product';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete product
export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete(`${API_URL}/products/${id}`, config);
            return id;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete product';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        clearProduct: (state) => {
            state.product = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all products
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get single product
            .addCase(getProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.product = action.payload.data;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get categories
            .addCase(getCategories.fulfilled, (state, action) => {
                state.categories = action.payload.data;
            })
            // Get featured products
            .addCase(getFeaturedProducts.fulfilled, (state, action) => {
                state.featuredProducts = action.payload.data;
            })
            // Create product
            .addCase(createProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products.push(action.payload.data);
                state.message = 'Product created successfully';
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = state.products.map((product) =>
                    product._id === action.payload.data._id ? action.payload.data : product
                );
                state.message = 'Product updated successfully';
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete product
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = state.products.filter(
                    (product) => product._id !== action.payload
                );
                state.message = 'Product deleted successfully';
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clearProduct } = productSlice.actions;
export default productSlice.reducer;
