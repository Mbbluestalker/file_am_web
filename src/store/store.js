import { configureStore } from '@reduxjs/toolkit';

/**
 * REDUX STORE CONFIGURATION
 *
 * Central state management store.
 * Add your reducers and middleware here as needed.
 */

// Dummy reducer to satisfy Redux requirements
// Replace with actual reducers as you build features
const dummyReducer = (state = {}) => state;

const store = configureStore({
  reducer: {
    // Temporary dummy reducer - replace with actual reducers
    app: dummyReducer,
    // Example: auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
