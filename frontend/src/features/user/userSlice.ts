import { showNotification } from "@mantine/notifications";
import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  apiDeleteUserById,
  apiFetchAllUsers,
  apiUpdateUserById,
  register,
} from "../../utils/apiCalls";
import {
  APICustomResponse,
  IPatchUserAPIProps,
  IRegisterAPIProps,
  IUser,
} from "../../utils/types";

export interface IUserState {
  isLoading: boolean;
  users: IUser[];
}

const initialState: IUserState = {
  isLoading: false,
  users: [] as IUser[],
};

// Fetch all users
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const res: APICustomResponse<{}> = await apiFetchAllUsers();
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

// Add User
export const addUser = createAsyncThunk(
  "user/addUser",
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

// Update User by Id
export const updateUserById = createAsyncThunk(
  "user/updateUserById",
  async (data: IPatchUserAPIProps, thunkAPI) => {
    try {
      const res: APICustomResponse<{}> = await apiUpdateUserById(data);
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

// Delete User by Id
export const deleteUserById = createAsyncThunk(
  "user/deleteUserById",
  async (id: string, thunkAPI) => {
    try {
      const res: APICustomResponse<{}> = await apiDeleteUserById(id);
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

const userSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    userReset: (state: IUserState) => {
      state.isLoading = false;
      state.users = [] as IUser[];
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<IUserState>) => {
    builder
      .addCase(fetchAllUsers.pending, (state: IUserState) => {
        state.isLoading = true;
      })
      .addCase(
        fetchAllUsers.fulfilled,
        (state: IUserState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.users = action.payload.data as IUser[];
        }
      )
      .addCase(fetchAllUsers.rejected, (state: IUserState) => {
        state.isLoading = false;
      })
      .addCase(addUser.pending, (state: IUserState) => {
        state.isLoading = true;
      })
      .addCase(
        addUser.fulfilled,
        (state: IUserState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.users.push(action.payload.data as IUser);
        }
      )
      .addCase(addUser.rejected, (state: IUserState) => {
        state.isLoading = false;
      })
      .addCase(updateUserById.pending, (state: IUserState) => {
        state.isLoading = true;
      })
      .addCase(
        updateUserById.fulfilled,
        (state: IUserState, action: PayloadAction<APICustomResponse<{}>>) => {
          const data = action.payload.data as IUser;
          state.isLoading = false;
          state.users = state.users.map((user) => {
            return user.id === data.id ? data : user;
          });
        }
      )
      .addCase(updateUserById.rejected, (state: IUserState) => {
        state.isLoading = false;
      })
      .addCase(deleteUserById.pending, (state: IUserState) => {
        state.isLoading = true;
      })
      .addCase(
        deleteUserById.fulfilled,
        (state: IUserState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.users = state.users.filter((user) => {
            return user.id !== action.payload.data;
          });
        }
      )
      .addCase(deleteUserById.rejected, (state: IUserState) => {
        state.isLoading = false;
      });
  },
});

export const { userReset } = userSlice.actions;
export default userSlice.reducer;
