import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import walletReducer from './walletReducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['wallet'],
};

const rootReducer = combineReducers({
  // your other reducers
  wallet: walletReducer,
});

export default persistReducer(persistConfig, rootReducer);
