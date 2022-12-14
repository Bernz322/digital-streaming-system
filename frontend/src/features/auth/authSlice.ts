import { showNotification } from "@mantine/notifications";
import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  apiFetchCurrentLoggedUser,
  login,
  register,
} from "../../utils/apiCalls";
import { deleteCookie, isError, isLoggedIn } from "../../utils/helpers";
import { IRegisterAPIProps, APICustomResponse, IUser } from "../../utils/types";
import { userReset } from "../user/userSlice";

export interface IAuthState {
  loggedIn: boolean;
  user: IUser;
  isLoading: boolean;
}

const status = isLoggedIn();

const initialState: IAuthState = {
  loggedIn: status,
  user: {} as IUser,
  isLoading: false,
};

// Login User
export const authLogin = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await login(data.email, data.password);
      if (res.status === "fail") throw new Error(res.message);
      thunkAPI.dispatch(authCreds());
      return res;
    } catch (error: any) {
      const message = isError(
        error,
        "Login failed. See message below for more info."
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Register User
export const authRegister = createAsyncThunk(
  "auth/register",
  async (data: IRegisterAPIProps, thunkAPI) => {
    const userData: IRegisterAPIProps = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    };
    try {
      const res: APICustomResponse<{}> = await register(userData);
      if (res.status === "fail") throw new Error(res.message);
      return showNotification({
        title: "Registered successfully.",
        message: "Please wait for your account activation.",
        autoClose: 3000,
        color: "green",
      });
    } catch (error: any) {
      const message = isError(
        error,
        "Registration failed. See message below for more info."
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout User
export const authLogout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    deleteCookie({
      cookieName: "accessToken",
      path: "/",
      domain: "localhost",
    });
    dispatch(authReset());
    dispatch(userReset());
  }
);

// Current User
export const authCreds = createAsyncThunk(
  "auth/authCreds",
  async (_, thunkAPI) => {
    try {
      const res: APICustomResponse<{}> = await apiFetchCurrentLoggedUser();
      if (res.status === "fail") throw new Error(res.message);
      return res;
    } catch (error: any) {
      const message = isError(
        error,
        "Fecthing your information failed. Please login again."
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authReset: (state: IAuthState) => {
      state.loggedIn = false;
      state.user = {} as IUser;
      state.isLoading = false;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<IAuthState>) => {
    builder
      .addCase(authLogin.pending, (state: IAuthState) => {
        state.isLoading = true;
        state.loggedIn = false;
      })
      .addCase(authLogin.fulfilled, (state: IAuthState) => {
        state.loggedIn = true;
        state.isLoading = false;
      })
      .addCase(authLogin.rejected, (state: IAuthState) => {
        state.isLoading = false;
        state.loggedIn = false;
      })
      .addCase(authRegister.pending, (state: IAuthState) => {
        state.isLoading = true;
      })
      .addCase(authRegister.fulfilled, (state: IAuthState) => {
        state.isLoading = false;
      })
      .addCase(authRegister.rejected, (state: IAuthState) => {
        state.isLoading = false;
      })
      .addCase(authLogout.pending, (state: IAuthState) => {
        state.isLoading = true;
        state.loggedIn = false;
        state.user = {} as IUser;
      })
      .addCase(authLogout.fulfilled, (state: IAuthState) => {
        state.loggedIn = false;
        state.isLoading = false;
      })
      .addCase(authLogout.rejected, (state: IAuthState) => {
        state.isLoading = false;
        state.loggedIn = false;
      })
      .addCase(authCreds.pending, (state: IAuthState) => {
        state.isLoading = true;
      })
      .addCase(
        authCreds.fulfilled,
        (state: IAuthState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.user = action.payload.data as IUser;
        }
      )
      .addCase(authCreds.rejected, (state: IAuthState) => {
        state.isLoading = false;
      });
  },
});

export const { authReset } = authSlice.actions;
export default authSlice.reducer;
