import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  apiDeleteActorById,
  apiFetchActorById,
  apiFetchAllActors,
  apiFetchSearchedActors,
  apiPostActor,
  apiUpdateActorById,
} from "../../utils/apiCalls";
import { isError } from "../../utils/helpers";
import { APICustomResponse, IActor, IPostActor } from "../../utils/types";

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
  "actors/fetchAllActors",
  async (_, thunkAPI) => {
    try {
      const res = await apiFetchAllActors();
      if (res.status === "fail") throw new Error(res.message);
      return res;
    } catch (error: any) {
      const message = isError(
        error,
        "Fetching all actors failed. See message below for more info."
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch searched actors by first name or last name
export const fetchSearchedActors = createAsyncThunk(
  "actors/fetchSearchedActors",
  async (name: string, thunkAPI) => {
    try {
      const res = await apiFetchSearchedActors(name);
      if (res.status === "fail") throw new Error(res.message);
      return res;
    } catch (error: any) {
      const message = isError(
        error,
        "Fetching actor by name failed. See message below for more info."
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch actor by id
export const fetchActorById = createAsyncThunk(
  "actors/fetchActorById",
  async (actorId: string, thunkAPI) => {
    try {
      const res = await apiFetchActorById(actorId);
      if (res.status === "fail") throw new Error(res.message);
      return res;
    } catch (error: any) {
      const message = isError(
        error,
        "Fetching actor by id failed. See message below for more info."
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add Actor
export const addActor = createAsyncThunk(
  "actors/addActor",
  async (data: IPostActor, thunkAPI) => {
    const actorData: IPostActor = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      age: data.age,
      image: data.image,
      link: data.link,
    };
    try {
      const res: APICustomResponse<{}> = await apiPostActor(actorData);
      if (res.status === "fail") throw new Error(res.message);
      return res;
    } catch (error: any) {
      const message = isError(
        error,
        "Adding actor failed. See message below for more info."
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Actor by Id
export const updateActorById = createAsyncThunk(
  "actors/updateActorById",
  async (data: IPostActor, thunkAPI) => {
    const actorData: IPostActor = {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      age: data.age,
      image: data.image,
      link: data.link,
    };
    try {
      const res: APICustomResponse<{}> = await apiUpdateActorById(actorData);
      if (res.status === "fail") throw new Error(res.message);
      return res;
    } catch (error: any) {
      const message = isError(
        error,
        "Updating actor failed. See message below for more info."
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete Actor by Id
export const deleteActorById = createAsyncThunk(
  "actors/deleteActorById",
  async (id: string, thunkAPI) => {
    try {
      const res: APICustomResponse<{}> = await apiDeleteActorById(id);
      if (res.status === "fail") throw new Error(res.message);
      return res;
    } catch (error: any) {
      const message = isError(
        error,
        "Deleting actor failed. See message below for more info."
      );
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
      })
      .addCase(addActor.pending, (state: IActorState) => {
        state.isLoading = true;
      })
      .addCase(
        addActor.fulfilled,
        (state: IActorState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.actors.push(action.payload.data as IActor);
        }
      )
      .addCase(addActor.rejected, (state: IActorState) => {
        state.isLoading = false;
      })
      .addCase(updateActorById.pending, (state: IActorState) => {
        state.isLoading = true;
      })
      .addCase(
        updateActorById.fulfilled,
        (state: IActorState, action: PayloadAction<APICustomResponse<{}>>) => {
          const data = action.payload.data as IActor;
          state.isLoading = false;
          state.actors = state.actors.map((actor) => {
            return actor.id === data.id ? data : actor;
          });
        }
      )
      .addCase(updateActorById.rejected, (state: IActorState) => {
        state.isLoading = false;
      })
      .addCase(deleteActorById.pending, (state: IActorState) => {
        state.isLoading = true;
      })
      .addCase(
        deleteActorById.fulfilled,
        (state: IActorState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.actors = state.actors.filter((actor) => {
            return actor.id !== action.payload.data;
          });
        }
      )
      .addCase(deleteActorById.rejected, (state: IActorState) => {
        state.isLoading = false;
      });
  },
});

export const { actorReset } = actorSlice.actions;
export default actorSlice.reducer;
