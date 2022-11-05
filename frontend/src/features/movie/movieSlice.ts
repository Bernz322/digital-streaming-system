import { showNotification } from "@mantine/notifications";
import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  apiDeleteMovieById,
  apiDeleteReviewById,
  apiFetchAllMovies,
  apiFetchLimitMovies,
  apiFetchMovieById,
  apiFetchMovieReviewsById,
  apiFetchSearchedMovies,
  apiPostMovie,
  apiPostMovieReview,
  apiUpdateMovieById,
  apiUpdateReviewById,
} from "../../utils/apiCalls";
import { isError } from "../../utils/helpers";
import {
  APICustomResponse,
  IMovie,
  IMovieReview,
  IPatchMovie,
  IPatchReviewProps,
  IPostMovie,
  IPostReviewProps,
} from "../../utils/types";

export interface IMovieState {
  isLoading: boolean;
  movies: IMovie[];
  selectedMovie: IMovie;
  selectedMovieReviews: IMovieReview[];
}

const initialState: IMovieState = {
  isLoading: false,
  movies: [] as IMovie[],
  selectedMovie: {} as IMovie,
  selectedMovieReviews: [],
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
      const message = isError(
        error,
        `Fetching ${limit} amount of movies failed. See message below for more info.`
      );
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
      const message = isError(
        error,
        "Fetching all movies failed. See message below for more info."
      );
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
      const message = isError(
        error,
        "Fetching movies by title failed. See message below for more info."
      );
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
      const message = isError(
        error,
        "Fetching movie by id failed. See message below for more info."
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add Movie
export const addMovie = createAsyncThunk(
  "movies/addMovie",
  async (data: IPostMovie, thunkAPI) => {
    const movieData: IPostMovie = {
      title: data.title,
      description: data.description,
      cost: data.cost,
      yearReleased: data.yearReleased,
      image: data.image,
      actors: data.actors,
    };
    try {
      const res: APICustomResponse<{}> = await apiPostMovie(movieData);
      if (res.status === "fail") throw new Error(res.message);
      return res;
    } catch (error: any) {
      const message = isError(
        error,
        "Adding movie failed. See message below for more info."
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Movie by Id
export const updateMovieById = createAsyncThunk(
  "movies/updateMovieById",
  async (data: IPatchMovie, thunkAPI) => {
    const movieData: IPatchMovie = {
      id: data.id,
      description: data.description,
      cost: data.cost,
      image: data.image,
    };
    try {
      const res: APICustomResponse<{}> = await apiUpdateMovieById(movieData);
      if (res.status === "fail") throw new Error(res.message);
      return res;
    } catch (error: any) {
      const message = isError(
        error,
        "Updating movie failed. See message below for more info."
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteMovieById = createAsyncThunk(
  "movies/deleteMovieById",
  async (id: string, thunkAPI) => {
    try {
      const res: APICustomResponse<{}> = await apiDeleteMovieById(id);
      if (res.status === "fail") throw new Error(res.message);
      return res;
    } catch (error: any) {
      const message = isError(
        error,
        "Deleting movie failed. See message below for more info."
      );
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
      const message = isError(
        error,
        "Adding review failed. See message below for more info."
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch movie reviews by id
export const fetchMovieReviewsById = createAsyncThunk(
  "reviews/fetchMovieReviewsById",
  async (movieId: string, thunkAPI) => {
    try {
      const res = await apiFetchMovieReviewsById(movieId);
      if (res.status === "fail") throw new Error(res.message);
      return res;
    } catch (error: any) {
      const message = isError(
        error,
        "Fetching all movie reviews failed. See message below for more info."
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Movie Review status by Id
export const updateMovieReviewById = createAsyncThunk(
  "reviews/updateMovieReviewById",
  async (data: IPatchReviewProps, thunkAPI) => {
    const reviewData: IPatchReviewProps = {
      id: data.id,
      isApproved: data.isApproved,
    };
    try {
      const res: APICustomResponse<{}> = await apiUpdateReviewById(reviewData);
      if (res.status === "fail") throw new Error(res.message);
      return res;
    } catch (error: any) {
      const message = isError(
        error,
        "Updating review failed. See message below for more info."
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteMovieReviewById = createAsyncThunk(
  "reviews/deleteMovieReviewById",
  async (id: string, thunkAPI) => {
    try {
      const res: APICustomResponse<{}> = await apiDeleteReviewById(id);
      if (res.status === "fail") throw new Error(res.message);
      return res;
    } catch (error: any) {
      const message = isError(
        error,
        "Deleting review failed. See message below for more info."
      );
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
      state.selectedMovieReviews = [] as IMovieReview[];
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
      })
      .addCase(addMovie.pending, (state: IMovieState) => {
        state.isLoading = true;
      })
      .addCase(
        addMovie.fulfilled,
        (state: IMovieState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.movies.push(action.payload.data as IMovie);
        }
      )
      .addCase(addMovie.rejected, (state: IMovieState) => {
        state.isLoading = false;
      })
      .addCase(updateMovieById.pending, (state: IMovieState) => {
        state.isLoading = true;
      })
      .addCase(
        updateMovieById.fulfilled,
        (state: IMovieState, action: PayloadAction<APICustomResponse<{}>>) => {
          const data = action.payload.data as IMovie;
          state.isLoading = false;
          state.movies = state.movies.map((movie) => {
            return movie.id === data.id ? data : movie;
          });
        }
      )
      .addCase(updateMovieById.rejected, (state: IMovieState) => {
        state.isLoading = false;
      })
      .addCase(deleteMovieById.pending, (state: IMovieState) => {
        state.isLoading = true;
      })
      .addCase(
        deleteMovieById.fulfilled,
        (state: IMovieState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.movies = state.movies.filter((movie) => {
            return movie.id !== action.payload.data;
          });
        }
      )
      .addCase(deleteMovieById.rejected, (state: IMovieState) => {
        state.isLoading = false;
      })
      .addCase(fetchMovieReviewsById.pending, (state: IMovieState) => {
        state.isLoading = true;
      })
      .addCase(
        fetchMovieReviewsById.fulfilled,
        (state: IMovieState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.selectedMovieReviews = action.payload.data as IMovieReview[];
        }
      )
      .addCase(fetchMovieReviewsById.rejected, (state: IMovieState) => {
        state.isLoading = false;
      })
      .addCase(updateMovieReviewById.pending, (state: IMovieState) => {
        state.isLoading = true;
      })
      .addCase(
        updateMovieReviewById.fulfilled,
        (state: IMovieState, action: PayloadAction<APICustomResponse<{}>>) => {
          const data = action.payload.data as IMovieReview;
          state.isLoading = false;
          state.selectedMovieReviews = state.selectedMovieReviews.map(
            (review) => {
              return review.id === data.id ? data : review;
            }
          );
        }
      )
      .addCase(updateMovieReviewById.rejected, (state: IMovieState) => {
        state.isLoading = false;
      })
      .addCase(deleteMovieReviewById.pending, (state: IMovieState) => {
        state.isLoading = true;
      })
      .addCase(
        deleteMovieReviewById.fulfilled,
        (state: IMovieState, action: PayloadAction<APICustomResponse<{}>>) => {
          state.isLoading = false;
          state.selectedMovieReviews = state.selectedMovieReviews.filter(
            (review) => {
              return review.id !== action.payload.data;
            }
          );
        }
      )
      .addCase(deleteMovieReviewById.rejected, (state: IMovieState) => {
        state.isLoading = false;
      });
  },
});

export const { movieReset } = movieSlice.actions;
export default movieSlice.reducer;
