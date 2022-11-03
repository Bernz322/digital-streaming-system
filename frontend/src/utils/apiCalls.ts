import axios, { AxiosRequestConfig } from "axios";
import {
  ILoginResponse,
  IRegisterAPIProps,
  APICustomResponse,
  IPostReviewProps,
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
 * Login API Request. If success, create a cookie w/ 6 hours duration storing the access token and set loggedUser id to local storage
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
 * Register API Request. After a successful registration, redirect to register success page
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
 * Fetch limited number of movies in the database
 * @param {number} filterLimit
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchLimitMovies = async (filterLimit: number) => {
  const res = await apiRequest<APICustomResponse<{}>>(
    `/movies?filter[limit]=${filterLimit}`
  );
  return res;
};

/**
 * Fetch all movies in the database
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchAllMovies = async () => {
  const res = await apiRequest<APICustomResponse<{}>>("/movies");
  return res;
};

/**
 * Fetch all movies by searched title
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchSearchedMovies = async (title: string) => {
  const res = await apiRequest<APICustomResponse<{}>>(
    `/search/movies/${title}`
  );
  return res;
};

/**
 * Fetch movie by id
 * @param {number} movieId
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchMovieById = async (movieId: string) => {
  const res = await apiRequest<APICustomResponse<{}>>(`/movies/${movieId}`);
  return res;
};

/**
 * Fetch all actors
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchAllActors = async () => {
  const res = await apiRequest<APICustomResponse<{}>>(`/actors`);
  return res;
};

/**
 * Fetch all actors by searched first name or last name
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchSearchedActors = async (name: string) => {
  const res = await apiRequest<APICustomResponse<{}>>(`/search/actors/${name}`);
  return res;
};

/**
 * Fetch actor by id
 * @param {number} actorId
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchActorById = async (actorId: string) => {
  const res = await apiRequest<APICustomResponse<{}>>(`/actors/${actorId}`);
  return res;
};

/**
 * Submit movie review
 * @param {number} actorId
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
 * Fetch all actors
 * @returns {APICustomResponse<{}>}
 */
export const apiFetchAllUsers = async () => {
  const res = await apiRequest<APICustomResponse<{}>>(`/users`);
  return res;
};
