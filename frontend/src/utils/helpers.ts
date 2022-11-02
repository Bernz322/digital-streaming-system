export interface ISetCookie {
  cookieName: string;
  value: string;
  daysToExpire: number;
}

export interface IDeleteCookie {
  cookieName: string;
  path: string;
  domain: string;
}

/**
 * Validates email address
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email: string): boolean => {
  if (email === "" || !email) throw new Error("Invalid email.");
  let atPosition: number = email.indexOf("@");
  let dotPosition: number = email.lastIndexOf(".");

  if (atPosition < 1 || dotPosition - atPosition < 2) {
    throw new Error("Invalid email.");
  }
  return true;
};

/**
 * Validates name
 * Taken from - https://stackoverflow.com/questions/42174375/javascript-validation-regex-for-names
 * @param {string} name
 * @returns {boolean}
 */
export const isValidName = (name: string, field: string): boolean => {
  if (name === "" || !name) throw new Error(`Invalid ${field} name.`);
  let nameRegex: RegExp = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/;
  if (name.match(nameRegex) == null) {
    throw new Error(`Invalid ${field} name.`);
  }
  return true;
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
 * @param {number} daysToExpire
 * @returns {void}
 */
export const setCookie = ({
  cookieName,
  value,
  daysToExpire,
}: ISetCookie): void => {
  const toStore: string = value;
  let currentDate: Date = new Date();
  currentDate.setDate(currentDate.getDate() + daysToExpire);
  document.cookie =
    cookieName +
    "=" +
    toStore +
    (daysToExpire == null ? "" : ";expires = " + currentDate.toUTCString()) +
    "; path=/";
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

export const budgetFormatter = (budgetCost: number): string => {
  return budgetCost.toLocaleString();
};
