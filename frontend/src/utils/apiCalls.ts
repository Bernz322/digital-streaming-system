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

export const baseAPIUrl = process.env.REACT_APP_API_ENDPOINT;

/**
 * API Request wrapper which adds the token to the request returns data directly from response
 * @param {string} path - the path of the API endpoint
 * @param {object} config - the configurations to be attached to the axios request
 * @returns - the response of the API
 */
const apiRequest = async <T>(
  path: string,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  const token = getCookie("accessToken");
  const request = {
    url: `${baseAPIUrl}${path}`,
    ...config,
  };

  // If there is token, attached it unto the request headers as bearer
  if (token) {
    if (!request.headers) request.headers = {};
    request.headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await axios(request);
  return res.data as T;
};

/**
 * Login API Request. If success, create a cookie w/ 6 hours duration storing the access token
 * @param {string} email - the email of the user
 * @param {string} password - the password of the user
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
  }
  return res;
};

/**
 * Register/add user post request.
 * @param {string} firstName - the first name of the user
 * @param {string} lastName - the last name of the user
 * @param {string} email - the email of the user
 * @param {string} password - the password of the user
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
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
 * @param {number} filterLimit - the amount of documents we request to the API endpoint
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
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
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
 */
export const apiFetchAllMovies = async (): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>("/movies");
  return res;
};

/**
 * Fetch all movies based on searched movie title
 * @param {string} title - the title of the movie to be searched
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
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
 * @param {string} movieId - the id of the movie to be fetched
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
 */
export const apiFetchMovieById = async (
  movieId: string
): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/movies/${movieId}`);
  return res;
};

/**
 * Add movie post request
 * @param {IPostMovie} data - the data to be attached unto the request
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
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
 * @param {IPatchMovie} data - the data to be attached unto the request together with the movie id
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
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
 * @param {string} movieId - the movie id to be deleted
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
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
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
 */
export const apiFetchAllActors = async (): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/actors`);
  return res;
};

/**
 * Fetch all actors based on searched first name or last name
 * @param {string} name - the name (first/ last) of the actor to be searched
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
 */
export const apiFetchSearchedActors = async (
  name: string
): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/search/actors/${name}`);
  return res;
};

/**
 * Fetch actor by id
 * @param {string} actorId the id of the actor to be fetched
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
 */
export const apiFetchActorById = async (
  actorId: string
): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/actors/${actorId}`);
  return res;
};

/**
 * Add actor post request
 * @param {IPostActor} data - the data to be attached unto the request
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
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
 * @param {IPostActor} data - the data to be attached unto the request together with the actor id
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
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
 * @param {string} actorId - the movie id to be deleted
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
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
 * @param {string} movieId - the movie id
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
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
 * @param {IPostReviewProps} data - the data to be attached unto the request
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
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
 * @param {IPatchReviewProps} data - the data to be attached unto the request together with the review id
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
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
 * Fetch all users in users collection
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
 */
export const apiFetchAllUsers = async (): Promise<APICustomResponse<{}>> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/users`);
  return res;
};

/**
 * Update user by given user id
 * @param {IPatchUserAPIProps} data - the data to be attached unto the request together with the user id
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
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
 * @param {string} userId - the user id to be deleted
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
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

/**
 * Fetch the data of the current logged in user based on the given accessToken (JWT)
 * @returns {APICustomResponse<{}>} - a promise of the returned data from the API
 */
export const apiFetchCurrentLoggedUser = async (): Promise<
  APICustomResponse<{}>
> => {
  const res = await apiRequest<APICustomResponse<{}>>(`/users/me`);
  return res;
};
