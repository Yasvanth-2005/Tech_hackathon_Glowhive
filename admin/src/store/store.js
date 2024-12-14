import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from './authSlice'; // Import your auth reducer
import complaintsReducer from './complaintsSlice'; // Import complaints reducer

// Persist config for auth slice
const persistConfig = {
  key: 'auth', // Persist only the auth slice
  storage,
  whitelist: ['user'], // Only persist the user field in the auth state
};

// Combine reducers, adding the auth and complaints reducers
const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer), // Persist only auth reducer
  complaints: complaintsReducer, // Add complaints reducer to the root
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore serializability warnings for persist actions
      },
    }),
});

export const persistor = persistStore(store);

export default store;
