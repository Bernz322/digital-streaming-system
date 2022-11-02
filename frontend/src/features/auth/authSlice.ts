import { showNotification } from "@mantine/notifications";
import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { login, register } from "../../utils/apiCalls";
import { deleteCookie, isLoggedIn } from "../../utils/helpers";
import {
  ILoginResponse,
  IRegisterAPIProps,
  APICustomResponse,
  IUserLogin,
} from "../../utils/types";

export interface IAuthState {
  loggedIn: boolean;
  user: IUserLogin;
  isLoading: boolean;
}

const status = isLoggedIn();
const storedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");

const initialState: IAuthState = {
  loggedIn: status,
  user: storedUser ? storedUser : ({} as IUserLogin),
  isLoading: false,
};

// Login User
export const authLogin = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await login(data.email, data.password);
      if (res.status === "fail") throw new Error(res.message);
      return res;
    } catch (error: any) {
      const message: string =
        (error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      showNotification({
        title: "Something went wrong.",
        message: message,
        autoClose: 5000,
        color: "red",
      });
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
        autoClose: 5000,
        color: "yellow",
      });
    } catch (error: any) {
      const message: string =
        (error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout User
export const authLogout = createAsyncThunk("auth/logout", async () => {
  deleteCookie({
    cookieName: "accessToken",
    path: "/",
    domain: "localhost",
  });
  localStorage.removeItem("loggedUser");
  // TODO: Reset all states here
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authReset: (state: IAuthState) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<IAuthState>) => {
    builder
      .addCase(authLogin.pending, (state: IAuthState) => {
        state.isLoading = true;
        state.loggedIn = false;
      })
      .addCase(
        authLogin.fulfilled,
        (state: IAuthState, action: PayloadAction<ILoginResponse>) => {
          state.loggedIn = true;
          state.isLoading = false;
          state.user = action.payload.data.user;
        }
      )
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
        state.user = {} as IUserLogin;
      })
      .addCase(authLogout.fulfilled, (state: IAuthState) => {
        state.loggedIn = false;
        state.isLoading = false;
      })
      .addCase(authLogout.rejected, (state: IAuthState) => {
        state.isLoading = false;
        state.loggedIn = false;
      });
  },
});

export const { authReset } = authSlice.actions;
export default authSlice.reducer;
