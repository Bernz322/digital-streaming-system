import { showNotification } from "@mantine/notifications";
import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { apiFetchMovies } from "../../utils/apiCalls";
import { APICustomResponse, IMovie } from "../../utils/types";

export interface IMovieState {
  isLoading: boolean;
  movies: IMovie[];
  selectedMovie: IMovie;
}

const initialState: IMovieState = {
  isLoading: false,
  movies: [] as IMovie[],
  selectedMovie: {} as IMovie,
};

// Fetch all movies (limit 10)
export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (_, thunkAPI) => {
    try {
      const res = await apiFetchMovies();
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

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    movieReset: (state: IMovieState) => {
      state.isLoading = false;
      state.movies = [] as IMovie[];
      state.selectedMovie = {} as IMovie;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<IMovieState>) => {
    builder
      .addCase(fetchMovies.pending, (state: IMovieState) => {
        state.isLoading = true;
      })
      .addCase(
        fetchMovies.fulfilled,
        (state: IMovieState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.movies = action.payload.data as IMovie[];
        }
      )
      .addCase(fetchMovies.rejected, (state: IMovieState) => {
        state.isLoading = false;
      });
  },
});

export const { movieReset } = movieSlice.actions;
export default movieSlice.reducer;
