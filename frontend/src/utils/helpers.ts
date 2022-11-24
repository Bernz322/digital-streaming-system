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
 * @param {string} email - the email to be validated
 * @returns {void}
 */
export const isValidEmail = (email: string): void => {
  if (email?.trim() === "" || !email)
    throw new Error("Field email is required.");
  const atPosition: number = email.indexOf("@");
  const dotPosition: number = email.lastIndexOf(".");

  if (atPosition < 1 || dotPosition - atPosition < 2) {
    throw new Error("Invalid email.");
  }
};

/**
 * Checks if a given name is empty or valid
 * Taken from - https://stackoverflow.com/questions/2282700/how-can-i-validate-a-full-name-input-in-a-form-using-javascript
 * @param {string} name - the given name to be validated
 * @param {string} field - the given input field name to be used for throwing error message
 * @returns {void}
 */
export const isValidName = (name: string, field: string): void => {
  if (name?.trim() === "" || !name)
    throw new Error(`Field ${field} name is required.`);
  const nameRegex: RegExp = /^[a-zA-Z-' ]+$/;
  if (name?.trim().match(nameRegex) == null) {
    throw new Error(`Invalid ${field} name.`);
  }
};

/**
 * Checks if a given field is empty
 * @param {string} text - the given text or value of an input field
 * @param {string} field - the given input field name to be used for throwing error message
 * @returns {void}
 */
export const isNotEmpty = (text: string, field: string) => {
  if (text?.trim() === "" || !text)
    throw new Error(`Field ${field} is required.`);
};

/**
 * Checks if a given urlString is empty or a valid URL.
 * Skip actor link for empty validation
 * Taken from - https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
 * @param {string} urlString - the given url value to be validated
 * @param {string} field - the given input field to be validated
 * @returns {boolean} - returns true if not empty else throw an error
 */
export const isValidUrl = (urlString: string, field: string): boolean => {
  // Actor link can be empty, hence if the link is not the
  // actor link, then we have to check for empty value first.
  if ((urlString?.trim() === "" || !urlString) && field !== "actor link")
    throw new Error(`Field ${field} is required.`);
  try {
    // If the actor link is empty, to need to validate, else validate the link.
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
 * @param {string} name - the name of the cookie
 * @returns {boolean | string} - either returns the cookie value or false (cookie not found)
 */
export const getCookie = (name: string): boolean | string => {
  const match: RegExpMatchArray | null = document.cookie.match(
    new RegExp(`(^| )${name}=([^;]+)`)
  );
  if (match) {
    return match[2];
  }
  return false;
};

/**
 * Sets cookie in the browser after login
 * @param {string} cookieName - the name of the cookie to be stored in the browser
 * @param {string} value - the value of the cookie to be stored
 * @returns {void}
 */
export const setCookie = ({ cookieName, value }: ISetCookie): void => {
  // JWT in loopback by default expires in 6 hours. Hence, the cookie which stores that JWT must also expire after 6 hours
  const cookieDuration: number = 21600;
  document.cookie = `${cookieName}=${value};max-age=${cookieDuration}; path=/`;
};

/**
 * Deletes cookie in the browser after logout
 * @param {string} cookieName - the name of the cookie to be deleted
 * @param {string} path - the path of the cookie where it is stored
 * @param {string} domain - the domain name of the cookie where it is stored
 * @returns {void}
 */
export const deleteCookie = ({
  cookieName,
  path,
  domain,
}: IDeleteCookie): void => {
  if (getCookie(cookieName)) {
    document.cookie = `${cookieName}=;path=${path};domain=${domain};expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  }
};

/**
 * Checks if a user is logged in based on cookie stored
 * @returns {boolean} - returns true if cookie is present, else false.
 */
export const isLoggedIn = (): boolean => {
  return Boolean(getCookie("accessToken"));
};

/**
 * Formats movie budget cost (3000 -> 3,000)
 * @param {string} budgetCost - the given cost which needs to be formatted
 * @returns {string} - return the newly formatted cost
 */
export const budgetFormatter = (budgetCost: number): string => {
  return budgetCost?.toLocaleString();
};

/**
 * Return movie rating value by getting all review ratings of a movie
 * @param {movieReviews} movieReviews[] - an array of reviews in a particular movie
 * @returns {number} - the average rating of a movie
 */
export const movieRating = (movieReviews: IMovieReview[]): number => {
  let sum = 0;
  let length = 0;
  movieReviews?.forEach((review) => {
    // Although it is already expected that the returned reviews to be calculated are the only approved ones,
    // just ensure that only approved reviews gets counted.
    if (review.isApproved) {
      sum += review?.rating || 0;
      length += 1;
    }
  });
  const reviewCount = length || 1;
  return parseFloat((sum / reviewCount || 0).toFixed(2));
};

/**
 * Return message and show notification if an error from the api request occurs.
 * Notifications with red flags or theme means the error came from the backend.
 * @param {any} error - the error message
 * @param {string} title - the title of the error depending on the action
 * @returns {string} - return the error message for slices to reject in thunkAPI.rejectWithValue
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
    title,
    message,
    autoClose: 3000,
    color: "red",
  });
  return message;
};
