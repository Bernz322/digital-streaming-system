import { showNotification } from "@mantine/notifications";
import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  apiFetchActorById,
  apiFetchAllActors,
  apiFetchSearchedActors,
} from "../../utils/apiCalls";
import { APICustomResponse, IActor } from "../../utils/types";

export interface IActorState {
  isLoading: boolean;
  actors: IActor[];
  selectedActor: IActor;
}

const initialState: IActorState = {
  isLoading: false,
  actors: [] as IActor[],
  selectedActor: {} as IActor,
};

// Fetch all actors
export const fetchAllActors = createAsyncThunk(
  "movies/fetchAllActors",
  async (_, thunkAPI) => {
    try {
      const res = await apiFetchAllActors();
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

// Fetch searched actors by first name or last name
export const fetchSearchedActors = createAsyncThunk(
  "movies/fetchSearchedActors",
  async (name: string, thunkAPI) => {
    try {
      const res = await apiFetchSearchedActors(name);
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

// Fetch actor by id
export const fetchActorById = createAsyncThunk(
  "movies/fetchActorById",
  async (actorId: string, thunkAPI) => {
    try {
      const res = await apiFetchActorById(actorId);
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

const actorSlice = createSlice({
  name: "actor",
  initialState,
  reducers: {
    actorReset: (state: IActorState) => {
      state.isLoading = false;
      state.actors = [] as IActor[];
      state.selectedActor = {} as IActor;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<IActorState>) => {
    builder
      .addCase(fetchAllActors.pending, (state: IActorState) => {
        state.isLoading = true;
        state.selectedActor = {} as IActor;
      })
      .addCase(
        fetchAllActors.fulfilled,
        (state: IActorState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.actors = action.payload.data as IActor[];
        }
      )
      .addCase(fetchAllActors.rejected, (state: IActorState) => {
        state.isLoading = false;
        state.selectedActor = {} as IActor;
      })
      .addCase(fetchSearchedActors.pending, (state: IActorState) => {
        state.isLoading = true;
        state.selectedActor = {} as IActor;
      })
      .addCase(
        fetchSearchedActors.fulfilled,
        (state: IActorState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.actors = action.payload.data as IActor[];
        }
      )
      .addCase(fetchSearchedActors.rejected, (state: IActorState) => {
        state.isLoading = false;
        state.selectedActor = {} as IActor;
      })
      .addCase(fetchActorById.pending, (state: IActorState) => {
        state.isLoading = true;
      })
      .addCase(
        fetchActorById.fulfilled,
        (state: IActorState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.selectedActor = action.payload.data as IActor;
        }
      )
      .addCase(fetchActorById.rejected, (state: IActorState) => {
        state.isLoading = false;
        state.selectedActor = {} as IActor;
      });
  },
});

export const { actorReset } = actorSlice.actions;
export default actorSlice.reducer;
