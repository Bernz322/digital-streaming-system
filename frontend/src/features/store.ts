import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import movieReducer from "./movie/movieSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movie: movieReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
