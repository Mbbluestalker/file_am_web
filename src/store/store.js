import { configureStore } from '@reduxjs/toolkit';

/**
 * REDUX STORE CONFIGURATION
 *
 * Central state management store.
 * Add your reducers and middleware here as needed.
 */
const store = configureStore({
  reducer: {
    // Add your reducers here
    // Example: auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
