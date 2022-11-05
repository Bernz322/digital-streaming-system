import axios, { AxiosRequestConfig } from "axios";
import {
  ILoginResponse,
  IRegisterAPIProps,
  APICustomResponse,
  IPostReviewProps,
  IPatchUserAPIProps,
  IPostActor,
  IPostMovie,
  IPatchMovie,
  IPatchReviewProps,
} from "./types";
import { getCookie, setCookie } from "./helpers";

/**
 * API Request wrapper which returns data directly from response (res.data)
 * @param {string} path
 * @param {object} config
 * @returns
 */
const apiRequest = async <T>(
  path: string,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  const token = getCookie("accessToken");
  const request = {
    url: `http://localhost:3000${path}`,
    ...config,
  };

  if (token) {
    if (!request.headers) request.headers = {};
    request.headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await axios(request);
  return res.data as T;
};

/**
 * Login API Request. If success, create a cookie w/ 6 hours duration storing the access token and set loggedUser data to local storage
 * @param {string} email
 * @param {string} password
 * @returns {ILoginResponse}
 */
export const login = async (
  email: string,
  password: string
): Promise<ILoginResponse> => {
  const res = await apiRequest<ILoginResponse>(`/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { email, password },
  });
  if (res.status === "success") {
    setCookie({
      cookieName: "accessToken",
      value: res.data.token,
    });
    localStorage.setItem("loggedUser", JSON.stringify(res.data.user));
  }
  return res;
};

/**
 * Register/add user post request.
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {string} password
 * @returns {APICustomResponse<{}>}
 */
export const register = async (
  data: IRegisterAPIProps
): Promise<APICustomResponse<{}>> => {
  const registerUser = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
  };
  const res = await apiRequest<APICustomResponse<{}>>(`/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    data: registerUser,
  });

  return res;
};

/**
 * Fetch limited amount of movies in movies collection
 * @param {number} filterLimit
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchLimitMovies = async (
  filterLimit: number
): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(
    `/movies?filter[limit]=${filterLimit}`
  );
  return res;
};

/**
 * Fetch all movies in movies collection
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchAllMovies = async (): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>("/movies");
  return res;
};

/**
 * Fetch all movies based on searched movie title
 * @param {string} title
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchSearchedMovies = async (
  title: string
): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(
    `/search/movies/${title}`
  );
  return res;
};

/**
 * Fetch movie by given id
 * @param {string} movieId
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchMovieById = async (
  movieId: string
): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/movies/${movieId}`);
  return res;
};

/**
 * Add movie post request
 * @param {IPostMovie} data
 * @returns {APICustomResponse<{}>}
 */
export const apiPostMovie = async (
  data: IPostMovie
): Promise<APICustomResponse<{}>> => {
  const movieData: IPostMovie = {
    title: data.title,
    description: data.description,
    cost: data.cost,
    yearReleased: data.yearReleased,
    image: data.image,
    actors: data.actors,
  };
  const res = await apiRequest<APICustomResponse<{}>>(`/movies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    data: movieData,
  });
  return res;
};

/**
 * Update movie by given movie id
 * @param {IPatchMovie} data
 * @returns {APICustomResponse<{}>}
 */
export const apiUpdateMovieById = async (
  data: IPatchMovie
): Promise<APICustomResponse<{}>> => {
  let { id, ...updatedMovie } = data;
  const res = await apiRequest<APICustomResponse<{}>>(`/movies/${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: updatedMovie,
  });
  return res;
};

/**
 * Delete movie by given movie id
 * @param {string} movieId
 * @returns {APICustomResponse<{}>}
 */
export const apiDeleteMovieById = async (
  movieId: string
): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/movies/${movieId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

/**
 * Fetch all actors in actors collection
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchAllActors = async (): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/actors`);
  return res;
};

/**
 * Fetch all actors based on searched first name or last name
 * @param {string} name
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchSearchedActors = async (
  name: string
): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/search/actors/${name}`);
  return res;
};

/**
 * Fetch actor by id
 * @param {string} actorId
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchActorById = async (
  actorId: string
): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/actors/${actorId}`);
  return res;
};

/**
 * Add actor post request
 * @param {IPostActor} data
 * @returns {APICustomResponse<{}>}
 */
export const apiPostActor = async (
  data: IPostActor
): Promise<APICustomResponse<{}>> => {
  const actorData: IPostActor = {
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    age: data.age,
    image: data.image,
    link: data.link,
  };
  const res = await apiRequest<APICustomResponse<{}>>(`/actors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    data: actorData,
  });
  return res;
};

/**
 * Update actor by given actor id
 * @param {IPostActor} data
 * @returns {APICustomResponse<{}>}
 */
export const apiUpdateActorById = async (
  data: IPostActor
): Promise<APICustomResponse<{}>> => {
  let { id, ...updatedActor } = data;
  const res = await apiRequest<APICustomResponse<{}>>(`/actors/${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: updatedActor,
  });
  return res;
};

/**
 * Delete actor by given actor id
 * @param {string} actorId
 * @returns {APICustomResponse<{}>}
 */
export const apiDeleteActorById = async (
  actorId: string
): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/actors/${actorId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

/**
 * Fetch all reviews of a movie
 * @param {string} movieId
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchMovieReviewsById = async (
  movieId: string
): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(
    `/reviews/movie/${movieId}`
  );
  return res;
};

/**
 * Add review to a movie
 * @param {IPostReviewProps} data
 * @returns {APICustomResponse<{}>}
 */
export const apiPostMovieReview = async (
  data: IPostReviewProps
): Promise<APICustomResponse<{}>> => {
  const reviewData = {
    description: data.description,
    rating: data.rating,
    movieId: data.movieId,
  };
  const res = await apiRequest<APICustomResponse<{}>>(`/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    data: reviewData,
  });
  return res;
};

/**
 * Update review by given review id
 * @param {IPatchReviewProps} data
 * @returns {APICustomResponse<{}>}
 */
export const apiUpdateReviewById = async (
  data: IPatchReviewProps
): Promise<APICustomResponse<{}>> => {
  let { id, ...isApproved } = data;
  const res = await apiRequest<APICustomResponse<{}>>(`/reviews/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: isApproved,
  });
  return res;
};

/**
 * Delete review by given review id
 * @param {string} reviewId
 * @returns {APICustomResponse<{}>}
 */
export const apiDeleteReviewById = async (
  reviewId: string
): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

/**
 * Fetch all users in users collection
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchAllUsers = async (): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/users`);
  return res;
};

/**
 * Update user by given user id
 * @param {IPatchUserAPIProps} data
 * @returns {APICustomResponse<{}>}
 */
export const apiUpdateUserById = async (
  data: IPatchUserAPIProps
): Promise<APICustomResponse<{}>> => {
  let { id, ...updatedUser } = data;
  const res = await apiRequest<APICustomResponse<{}>>(`/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: updatedUser,
  });
  return res;
};

/**
 * Delete user by given user id
 * @param {string} userId
 * @returns {APICustomResponse<{}>}
 */
export const apiDeleteUserById = async (
  userId: string
): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};
