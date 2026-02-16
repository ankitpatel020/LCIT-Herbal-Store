import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

// Helper to calculate totals
const calculateTotals = (items) => {
    const totalItems = items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
    const totalPrice = items.reduce(
        (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
    );
    return { totalItems, totalPrice };
};

// Get cart from localStorage with sanitization
const getLocalCart = () => {
    try {
        const stored = localStorage.getItem('cart');
        const cart = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(cart)) return [];

        // Sanitize items
        return cart.map(item => ({
            ...item,
            quantity: Math.max(1, Number(item.quantity) || 1), // Ensure at least 1, default 1
            price: Number(item.price) || 0
        })).filter(item => item._id); // Ensure ID exists
    } catch (e) {
        return [];
    }
};

const cartItems = getLocalCart();
const { totalItems, totalPrice } = calculateTotals(cartItems);

const initialState = {
    cartItems: cartItems,
    totalItems: totalItems,
    totalPrice: totalPrice,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const payload = action.payload;
            const quantity = Math.max(1, Number(payload.quantity || payload.qty) || 1);
            const price = Number(payload.price) || 0;

            const existingItem = state.cartItems.find((x) => x._id === payload._id);

            if (existingItem) {
                // Update quantity if item already exists
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existingItem._id
                        ? { ...x, quantity: (Number(x.quantity) || 0) + quantity }
                        : x
                );
                toast.success('Cart updated!');
            } else {
                // Add new item
                state.cartItems.push({
                    ...payload,
                    quantity,
                    price
                });
                toast.success('Added to cart!');
            }

            // Update totals
            const totals = calculateTotals(state.cartItems);
            state.totalItems = totals.totalItems;
            state.totalPrice = totals.totalPrice;

            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

            const totals = calculateTotals(state.cartItems);
            state.totalItems = totals.totalItems;
            state.totalPrice = totals.totalPrice;

            localStorage.setItem('cart', JSON.stringify(state.cartItems));
            toast.success('Removed from cart');
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const newQty = Number(quantity);

            if (isNaN(newQty) || newQty <= 0) {
                state.cartItems = state.cartItems.filter((x) => x._id !== id);
            } else {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === id ? { ...x, quantity: newQty } : x
                );
            }

            const totals = calculateTotals(state.cartItems);
            state.totalItems = totals.totalItems;
            state.totalPrice = totals.totalPrice;

            localStorage.setItem('cart', JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.totalItems = 0;
            state.totalPrice = 0;
            localStorage.removeItem('cart');
            // toast.success('Cart cleared'); // Optional, removed to prevent toast spam on checkout success
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;
