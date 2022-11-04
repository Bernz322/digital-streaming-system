import isemail from 'isemail';

/**
 * Validates name
 * @param {string} name
 * @returns {void}
 */
export const validateName = (name: string, field: string) => {
  let nameRegex: RegExp = /^[a-zA-Z]+[- ']{0,1}[a-zA-Z]+$/;
  if (name.match(nameRegex) == null) {
    throw new Error(`Invalid name in field ${field}`);
  }
};

/**
 * Validates email
 * @param {string} email
 * @returns {void}
 */
export const validateEmail = (email: string) => {
  if (!isemail.validate(email)) {
    throw new Error('Invalid email format.');
  }
};

export const isValidUrl = (urlString: string, field: string): boolean => {
  if (field === 'actor link') return true;
  if (urlString === '' || !urlString)
    throw new Error(`Field ${field} is required.`);
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    throw new Error(`Invalid ${field} url.`);
  }
};
