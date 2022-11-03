import { showNotification } from "@mantine/notifications";
import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { apiFetchAllUsers } from "../../utils/apiCalls";
import { APICustomResponse, IUser } from "../../utils/types";

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
      const res = await apiFetchAllUsers();
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
      });
  },
});

export const { userReset } = userSlice.actions;
export default userSlice.reducer;
