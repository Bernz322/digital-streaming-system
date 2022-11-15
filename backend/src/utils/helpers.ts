import isemail from 'isemail';

/**
 * Checks if a given name is empty or valid
 * Taken from - https://stackoverflow.com/questions/2282700/how-can-i-validate-a-full-name-input-in-a-form-using-javascript
 * @param {string} name - the given name to be validated
 * @param {string} field - the given input field name to be used for throwing error message
 * @returns {void}
 */
export const isValidName = (name: string, field: string): void => {
  if (name?.trim() === '' || !name)
    throw new Error(`Field ${field} name is required.`);
  const nameRegex = /^[a-zA-Z-' ]+$/;
  if (name?.trim().match(nameRegex) == null) {
    throw new Error(`Invalid name in field ${field}`);
  }
};

/**
 * Checks if a given field is empty or undefined
 * @param {string} text - the given text or value of an input field
 * @param {string} field - the given input field name to be used for throwing error message
 * @returns {void}
 */
export const isNotEmpty = (text: string, field: string): void => {
  if (text?.trim() === '' || !text)
    throw new Error(`Field ${field} is required.`);
};

/**
 * Checks if a given field is not null or an empty string
 * @param {string} text - the given url value to be validated
 * @param {string} field - the given input field to be validated
 * @returns {void}
 */
export const isNotNull = (text: string, field: string): void => {
  if (text.trim() === '')
    throw new Error(`Field ${field} should not be empty.`);
};

/**
 * Checks if a given urlString is empty or a valid URL.
 * Skip actor link for empty validation
 * Taken from - https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
 * @param {string} urlString - the given text or value of an input field
 * @param {string} field - the given input field name to be used for throwing error message
 * @returns {boolean} - returns true if not emopty else throw an error
 */
export const isValidUrl = (urlString: string, field: string): boolean => {
  if ((urlString?.trim() === '' || !urlString) && field !== 'actor link')
    throw new Error(`Field ${field} is required.`);
  try {
    if (field === 'actor link') {
      if (urlString?.trim() === '' || !urlString) return true;
    }
    return Boolean(new URL(urlString));
  } catch (e) {
    throw new Error(`Invalid ${field} url.`);
  }
};

/**
 * Validates email
 * @param {string} email - the email to be validated
 * @returns {void}
 */
export const validateEmail = (email: string): void => {
  if (!isemail.validate(email)) {
    throw new Error('Invalid email format.');
  }
};
