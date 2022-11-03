import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import movieReducer from "./movie/movieSlice";
import actorReducer from "./actor/actorSlice";
import userReducer from "./user/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movie: movieReducer,
    actor: actorReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
