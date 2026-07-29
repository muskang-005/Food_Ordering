// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import cartSlice from "../features/cartSlice";
import walletReducer from "../../reducers/walletReducer";
import authSlice from "../features/authSlice";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['wallet', 'allCart'], // Persist wallet and cart data
};

const rootReducer = combineReducers({
  allCart: cartSlice,
  wallet: walletReducer,
  auth: authSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
