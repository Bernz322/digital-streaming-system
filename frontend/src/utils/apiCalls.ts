import axios, { AxiosRequestConfig } from "axios";
import { ILoginResponse } from "./types";
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
      daysToExpire: 1,
    });
    localStorage.setItem("loggedUser", JSON.stringify(res.data.user));
  }
  return res;
};
