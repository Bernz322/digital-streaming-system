import {
  combineReducers,
  configureStore,
  PreloadedState,
} from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import movieReducer from "./movie/movieSlice";
import actorReducer from "./actor/actorSlice";
import userReducer from "./user/userSlice";

// Create the root reducer independently to obtain the RootState type
const rootReducer = combineReducers({
  auth: authReducer,
  movie: movieReducer,
  actor: actorReducer,
  user: userReducer,
});

export const createStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export const store = createStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore["dispatch"];
