import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/faqs` : '/api/faqs';

// Get Public FAQs
export const getFAQs = createAsyncThunk('faqs/getAll', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL);
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get Admin FAQs
export const getAdminFAQs = createAsyncThunk('faqs/getAdmin', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(`${API_URL}/admin`, config);
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create FAQ
export const createFAQ = createAsyncThunk('faqs/create', async (faqData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.post(API_URL, faqData, config);
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update FAQ
export const updateFAQ = createAsyncThunk('faqs/update', async ({ id, faqData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.put(`${API_URL}/${id}`, faqData, config);
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete FAQ
export const deleteFAQ = createAsyncThunk('faqs/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        await axios.delete(`${API_URL}/${id}`, config);
        return id;
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const faqSlice = createSlice({
    name: 'faq',
    initialState: {
        faqs: [],
        isLoading: false,
        isSuccess: false,
        isError: false,
        message: '',
    },
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
            .addCase(getFAQs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getFAQs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.faqs = action.payload;
            })
            .addCase(getFAQs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAdminFAQs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAdminFAQs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.faqs = action.payload;
            })
            .addCase(getAdminFAQs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createFAQ.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createFAQ.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.faqs.push(action.payload);
                state.message = 'FAQ created successfully';
            })
            .addCase(createFAQ.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateFAQ.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateFAQ.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.faqs = state.faqs.map((faq) =>
                    faq._id === action.payload._id ? action.payload : faq
                );
                state.message = 'FAQ updated successfully';
            })
            .addCase(updateFAQ.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteFAQ.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteFAQ.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.faqs = state.faqs.filter((faq) => faq._id !== action.payload);
                state.message = 'FAQ deleted successfully';
            })
            .addCase(deleteFAQ.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = faqSlice.actions;
export default faqSlice.reducer;
