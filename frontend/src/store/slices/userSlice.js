import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const initialState = {
    users: [],
    user: null,
    pendingStudents: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// Get all users
export const getAllUsers = createAsyncThunk(
    'users/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.get(`${API_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch users';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get pending student verifications
export const getPendingStudentVerifications = createAsyncThunk(
    'users/getPendingStudents',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.get(`${API_URL}/users/pending-students`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch pending verifications';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Approve student verification
export const approveStudentVerification = createAsyncThunk(
    'users/approveStudent',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.put(
                `${API_URL}/users/${id}/approve-student`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to approve student';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Reject student verification
export const rejectStudentVerification = createAsyncThunk(
    'users/rejectStudent',
    async ({ id, reason }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const response = await axios.put(
                `${API_URL}/users/${id}/reject-student`,
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
                error.response?.data?.message || error.message || 'Failed to reject student';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete user
export const deleteUser = createAsyncThunk(
    'users/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            await axios.delete(`${API_URL}/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to delete user';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
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
            // Get all users
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = action.payload.data;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get pending students
            .addCase(getPendingStudentVerifications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPendingStudentVerifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.pendingStudents = action.payload.data;
            })
            .addCase(getPendingStudentVerifications.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Approve student
            .addCase(approveStudentVerification.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(approveStudentVerification.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
                // Remove from pending list
                state.pendingStudents = state.pendingStudents.filter(
                    (student) => student._id !== action.payload.data._id
                );
                // Update in users list if present
                state.users = state.users.map((user) =>
                    user._id === action.payload.data._id ? action.payload.data : user
                );
            })
            .addCase(approveStudentVerification.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Reject student
            .addCase(rejectStudentVerification.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(rejectStudentVerification.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
                // Remove from pending list
                state.pendingStudents = state.pendingStudents.filter(
                    (student) => student._id !== action.payload.data._id
                );
                // Update in users list if present
                state.users = state.users.map((user) =>
                    user._id === action.payload.data._id ? action.payload.data : user
                );
            })
            .addCase(rejectStudentVerification.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete user
            .addCase(deleteUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = state.users.filter((user) => user._id !== action.payload);
                state.message = 'User deleted successfully';
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
