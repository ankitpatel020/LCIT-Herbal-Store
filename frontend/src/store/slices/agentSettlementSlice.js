import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/settlements` : '/api/settlements';

const getAuthConfig = (thunkAPI) => {
    const { user, token } = thunkAPI.getState().auth;
    const authToken = token || (user && user.token) || localStorage.getItem('token');
    if (!authToken) {
        throw new Error('Not authenticated. Please log in as admin.');
    }
    return { headers: { Authorization: `Bearer ${authToken}` } };
};

// Get Agent Settlement List
export const getAgentSettlements = createAsyncThunk(
    'agentSettlement/getAll',
    async (_, thunkAPI) => {
        try {
            const config = getAuthConfig(thunkAPI);
            const response = await axios.get(API_URL, config);
            return response.data.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get specific agent summary
export const getAgentSummary = createAsyncThunk(
    'agentSettlement/getSummary',
    async (agentId, thunkAPI) => {
        try {
            const config = getAuthConfig(thunkAPI);
            const response = await axios.get(`${API_URL}/${agentId}/summary`, config);
            return response.data.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get pending orders for agent
export const getPendingOrders = createAsyncThunk(
    'agentSettlement/getPendingOrders',
    async (agentId, thunkAPI) => {
        try {
            const config = getAuthConfig(thunkAPI);
            const response = await axios.get(`${API_URL}/${agentId}/pending-orders`, config);
            return response.data.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create settlement
export const createSettlement = createAsyncThunk(
    'agentSettlement/create',
    async (settlementData, thunkAPI) => {
        try {
            const config = getAuthConfig(thunkAPI);
            const { agentId, orderIds, paymentMethod, notes } = settlementData;
            const response = await axios.post(`${API_URL}/${agentId}/settle`, {
                orderIds,
                paymentMethod,
                notes
            }, config);
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get my own commission summary (for agent self-view)
export const getMyCommission = createAsyncThunk(
    'agentSettlement/getMyCommission',
    async (_, thunkAPI) => {
        try {
            const config = getAuthConfig(thunkAPI);
            const response = await axios.get(`${API_URL}/me`, config);
            return response.data.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    agents: [],
    selectedAgent: null,
    agentSummary: null,
    pendingOrders: [],
    myData: null,
    myPendingOrders: [],
    mySettledOrders: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const agentSettlementSlice = createSlice({
    name: 'agentSettlement',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        clearSelectedAgent: (state) => {
            state.selectedAgent = null;
            state.agentSummary = null;
            state.pendingOrders = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Agents
            .addCase(getAgentSettlements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAgentSettlements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.agents = action.payload;
            })
            .addCase(getAgentSettlements.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Summary
            .addCase(getAgentSummary.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAgentSummary.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.selectedAgent = action.payload.agent;
                state.agentSummary = action.payload.summary;
            })
            .addCase(getAgentSummary.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Pending Orders
            .addCase(getPendingOrders.pending, (state) => {
                // state.isLoading = true;
            })
            .addCase(getPendingOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.pendingOrders = action.payload;
            })
            .addCase(getPendingOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Create Settlement
            .addCase(createSettlement.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createSettlement.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Settlement created successfully';
                // Remove settled orders from pending list
                const settledIds = action.meta.arg.orderIds;
                state.pendingOrders = state.pendingOrders.filter(o => !settledIds.includes(o._id));
            })
            .addCase(createSettlement.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get My Commission
            .addCase(getMyCommission.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyCommission.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.myData = action.payload;
                state.myPendingOrders = action.payload.pendingOrders;
                state.mySettledOrders = action.payload.settledOrders;
            })
            .addCase(getMyCommission.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clearSelectedAgent } = agentSettlementSlice.actions;
export default agentSettlementSlice.reducer;
