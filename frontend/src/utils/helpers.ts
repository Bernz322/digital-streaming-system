import { showNotification } from "@mantine/notifications";
import { IMovieReview } from "./types";

export interface ISetCookie {
  cookieName: string;
  value: string;
}

export interface IDeleteCookie {
  cookieName: string;
  path: string;
  domain: string;
}

/**
 * Checks if a given email is empty or valid
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email: string): boolean => {
  if (email?.trim() === "" || !email)
    throw new Error("Field email is required.");
  let atPosition: number = email.indexOf("@");
  let dotPosition: number = email.lastIndexOf(".");

  if (atPosition < 1 || dotPosition - atPosition < 2) {
    throw new Error("Invalid email.");
  }
  return true;
};

/**
 * Checks if a given name is empty or valid
 * Taken from - https://stackoverflow.com/questions/2282700/how-can-i-validate-a-full-name-input-in-a-form-using-javascript
 * @param {string} name
 * @returns {boolean}
 */
export const isValidName = (name: string, field: string): boolean => {
  if (name?.trim() === "" || !name)
    throw new Error(`Field ${field} name is required.`);
  let nameRegex: RegExp = /^[a-zA-Z-' ]+$/;
  if (name?.trim().match(nameRegex) == null) {
    throw new Error(`Invalid ${field} name.`);
  }
  return true;
};

/**
 * Checks if a given field is empty
 * @param {string} text
 * @param {string} field
 * @returns {boolean}
 */
export const isNotEmpty = (text: string, field: string): boolean => {
  if (text?.trim() === "" || !text)
    throw new Error(`Field ${field} is required.`);
  return true;
};

/**
 * Checks if a given urlString is empty or a valid URL.
 * Skip actor link for empty validation
 * Taken from - https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
 * @param {string} urlString
 * @param {string} field
 * @returns {boolean}
 */
export const isValidUrl = (urlString: string, field: string): boolean => {
  if ((urlString?.trim() === "" || !urlString) && field !== "actor link")
    throw new Error(`Field ${field} is required.`);
  try {
    if (field === "actor link") {
      if (urlString?.trim() === "" || !urlString) return true;
    }
    return Boolean(new URL(urlString));
  } catch (e) {
    throw new Error(`Invalid ${field} url.`);
  }
};

/**
 * Get cookie in the browser
 * @param {string} name
 * @returns {boolean | string}
 */
export const getCookie = (name: string): boolean | string => {
  let match: RegExpMatchArray | null = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  if (match) {
    return match[2];
  } else {
    return false;
  }
};

/**
 * Sets cookie in the browser after login
 * @param {string} cookieName
 * @param {string} value
 * @returns {void}
 */
export const setCookie = ({ cookieName, value }: ISetCookie): void => {
  const cookieDuration: number = 21600;
  document.cookie = `${cookieName}=${value};max-age=${cookieDuration}; path=/`;
};

/**
 * Deletes cookie in the browser after logout
 * @param {string} cookieName
 * @param {string} path
 * @param {string} domain
 * @returns {void}
 */
export const deleteCookie = ({
  cookieName,
  path,
  domain,
}: IDeleteCookie): void => {
  if (getCookie(cookieName)) {
    document.cookie =
      cookieName +
      "=" +
      (path ? ";path=" + path : "") +
      (domain ? ";domain=" + domain : "") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
};

/**
 * Checks if a user is logged in
 * @returns {boolean}
 */
export const isLoggedIn = (): boolean => {
  return Boolean(
    localStorage.getItem("loggedUser") && getCookie("accessToken")
  );
};

/**
 * Formats movie budget cost (3000 -> 3,000)
 * @param {string} budgetCost
 * @returns {string}
 */
export const budgetFormatter = (budgetCost: number): string => {
  return budgetCost?.toLocaleString();
};

/**
 * Return movie rating value by getting all review ratings of a movie
 * @param {movieReviews} movieReviews[]
 * @returns {number}
 */
export const movieRating = (movieReviews: IMovieReview[]): number => {
  let sum = 0;
  let length = 0;
  movieReviews?.forEach((review) => {
    if (review.isApproved) {
      sum += review?.rating;
      length++;
    }
  });
  const reviewCount = length || 1;
  return parseFloat((sum / reviewCount || 0).toFixed(2));
};

/**
 * Return message and show notification if an error from the api request occurs
 * @param {any} error
 * @param {string} title
 * @returns {number}
 */
export const isError = (error: any, title: string): string => {
  const message: string =
    (error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.message) ||
    error.message ||
    error.toString();
  showNotification({
    title: title,
    message: message,
    autoClose: 3000,
    color: "red",
  });
  return message;
};
