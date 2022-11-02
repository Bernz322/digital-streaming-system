import isemail from 'isemail';

/**
 * Validates name
 * @param {string} name
 * @returns {void}
 */
export const validateName = (name: string, field: string) => {
  let nameRegex: RegExp = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/;
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
