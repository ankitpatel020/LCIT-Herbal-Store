import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
    user: user ? user : null,
    token: token ? token : null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Registration failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Login user
export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Login failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
});

// Update user profile
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.put(
                `${API_URL}/auth/updatedetails`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.data) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
            }
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Update failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Verify Student
export const verifyStudent = createAsyncThunk(
    'auth/verifyStudent',
    async (studentData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.post(
                `${API_URL}/users/verify-student`,
                studentData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.data) {
                const currentUser = JSON.parse(localStorage.getItem('user'));
                const updatedUser = { ...currentUser, ...response.data.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Verification failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Withdraw Verification
export const withdrawVerification = createAsyncThunk(
    'auth/withdrawVerification',
    async (type, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.put(
                `${API_URL}/users/verify-student/withdraw`,
                { type },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.data) {
                const currentUser = JSON.parse(localStorage.getItem('user'));
                const updatedUser = { ...currentUser, ...response.data.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Withdrawal failed';
            return thunkAPI.rejectWithValue(message);
        }
    }

);

// Load User
export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        if (!token) return thunkAPI.rejectWithValue('No token found');

        const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.data) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }

        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message || error.message || 'Failed to load user';
        return thunkAPI.rejectWithValue(message);
    }
});

const authSlice = createSlice({
    name: 'auth',
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
            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.token = null;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.token = null;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Verify Student
            .addCase(verifyStudent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyStudent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(verifyStudent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Withdraw Verification
            .addCase(withdrawVerification.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.data;
            })
            // Load User
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.data;
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
