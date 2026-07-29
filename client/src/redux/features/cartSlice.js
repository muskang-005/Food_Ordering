import { createSlice } from '@reduxjs/toolkit';
import Cardsdata from '../../components/CardData';

const initialState = {
    carts: [],
    favorites: [],
    item: [...Cardsdata],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.carts.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.qnty += 1;
            } else {
                state.carts.push({ ...action.payload, qnty: 1 });
            }
        },
        removeToCart: (state, action) => {
            state.carts = state.carts.filter(item => item.id !== action.payload);
        },
        removeSingleItem: (state, action) => {
            const item = state.carts.find(item => item.id === action.payload.id);
            if (item) {
                item.qnty -= 1;
                if (item.qnty <= 0) {
                    state.carts = state.carts.filter(item => item.id !== action.payload.id);
                }
            }
        },
        emptyCart: (state) => {
            state.carts = [];
        },
        addToFavorites: (state, action) => {
            const existingItem = state.favorites.find(item => item.id === action.payload.id);
            if (!existingItem) {
                state.favorites.push(action.payload);
            }
        },
        removeFromFavorites: (state, action) => {
            state.favorites = state.favorites.filter(item => item.id !== action.payload);
        },
        addProduct: (state, action) => {
            state.item.push({ ...action.payload, id: state.item.length + 1 });
        },
        editProduct: (state, action) => {
            const index = state.item.findIndex(product => product.id === action.payload.id);
            if (index !== -1) {
                state.item[index] = action.payload;
            }
        },
        deleteProduct: (state, action) => {
            state.item = state.item.filter(product => product.id !== action.payload);
        },
    },
});

export const { 
    addToCart, 
    removeToCart, 
    removeSingleItem, 
    emptyCart, 
    addToFavorites, 
    removeFromFavorites,
    addProduct,
    editProduct,
    deleteProduct 
} = cartSlice.actions;

export default cartSlice.reducer;
