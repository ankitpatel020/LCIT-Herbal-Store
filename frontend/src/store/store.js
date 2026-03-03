import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import reviewReducer from './slices/reviewSlice';
import analyticsReducer from './slices/analyticsSlice';
import couponReducer from './slices/couponSlice';
import faqReducer from './slices/faqSlice';
import agentSettlementReducer from './slices/agentSettlementSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        orders: orderReducer,
        users: userReducer,
        reviews: reviewReducer,
        analytics: analyticsReducer,
        coupons: couponReducer,
        faqs: faqReducer,
        agentSettlement: agentSettlementReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
