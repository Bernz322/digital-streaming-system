import { showNotification } from "@mantine/notifications";
import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  apiFetchAllMovies,
  apiFetchLimitMovies,
  apiFetchMovieById,
  apiFetchSearchedMovies,
  apiPostMovieReview,
} from "../../utils/apiCalls";
import { APICustomResponse, IMovie, IPostReviewProps } from "../../utils/types";

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

// Fetch movies (with limit)
export const fetchLimitMovies = createAsyncThunk(
  "movies/fetchLimitMovies",
  async (limit: number, thunkAPI) => {
    try {
      const res = await apiFetchLimitMovies(limit);
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

// Fetch all movies
export const fetchAllMovies = createAsyncThunk(
  "movies/fetchAllMovies",
  async (_, thunkAPI) => {
    try {
      const res = await apiFetchAllMovies();
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

// Fetch searched movies by title
export const fetchSearchedMovies = createAsyncThunk(
  "movies/fetchSearchedMovies",
  async (title: string, thunkAPI) => {
    try {
      const res = await apiFetchSearchedMovies(title);
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

// Fetch movie by id
export const fetchMovieById = createAsyncThunk(
  "movies/fetchMovieById",
  async (movieId: string, thunkAPI) => {
    try {
      const res = await apiFetchMovieById(movieId);
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

// Post movie review
export const postMovieReview = createAsyncThunk(
  "reviews/postMovieReview",
  async (data: IPostReviewProps, thunkAPI) => {
    const reviewData: IPostReviewProps = {
      description: data.description,
      rating: data.rating,
      movieId: data.movieId,
    };
    try {
      const res: APICustomResponse<{}> = await apiPostMovieReview(reviewData);
      if (res.status === "fail") throw new Error(res.message);
      return showNotification({
        title: "Your review was successfully received.",
        message: "Please wait for admin approval.",
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
      .addCase(fetchLimitMovies.pending, (state: IMovieState) => {
        state.isLoading = true;
        state.selectedMovie = {} as IMovie;
      })
      .addCase(
        fetchLimitMovies.fulfilled,
        (state: IMovieState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.movies = action.payload.data as IMovie[];
        }
      )
      .addCase(fetchLimitMovies.rejected, (state: IMovieState) => {
        state.isLoading = false;
        state.selectedMovie = {} as IMovie;
      })
      .addCase(fetchAllMovies.pending, (state: IMovieState) => {
        state.isLoading = true;
        state.selectedMovie = {} as IMovie;
      })
      .addCase(
        fetchAllMovies.fulfilled,
        (state: IMovieState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.movies = action.payload.data as IMovie[];
        }
      )
      .addCase(fetchAllMovies.rejected, (state: IMovieState) => {
        state.isLoading = false;
        state.selectedMovie = {} as IMovie;
      })
      .addCase(fetchSearchedMovies.pending, (state: IMovieState) => {
        state.isLoading = true;
      })
      .addCase(
        fetchSearchedMovies.fulfilled,
        (state: IMovieState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.movies = action.payload.data as IMovie[];
        }
      )
      .addCase(fetchSearchedMovies.rejected, (state: IMovieState) => {
        state.isLoading = false;
      })
      .addCase(fetchMovieById.pending, (state: IMovieState) => {
        state.isLoading = true;
      })
      .addCase(
        fetchMovieById.fulfilled,
        (state: IMovieState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.selectedMovie = action.payload.data as IMovie;
        }
      )
      .addCase(fetchMovieById.rejected, (state: IMovieState) => {
        state.isLoading = false;
      })
      .addCase(postMovieReview.pending, (state: IMovieState) => {
        state.isLoading = true;
      })
      .addCase(postMovieReview.fulfilled, (state: IMovieState) => {
        state.isLoading = false;
      })
      .addCase(postMovieReview.rejected, (state: IMovieState) => {
        state.isLoading = false;
      });
  },
});

export const { movieReset } = movieSlice.actions;
export default movieSlice.reducer;
