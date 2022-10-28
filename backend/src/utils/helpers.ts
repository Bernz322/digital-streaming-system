import isemail from 'isemail';
import {HttpErrors} from '@loopback/rest';

/**
 * Validates name
 * @param {string} name
 * @returns {void}
 */
export const validateName = (name: string, field: string) => {
  let nameRegex: RegExp = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/;
  if (name.match(nameRegex) == null) {
    throw new HttpErrors.UnprocessableEntity(`Invalid name in field ${field}`);
  }
};

/**
 * Validates email
 * @param {string} email
 * @returns {void}
 */
export const validateEmail = (email: string) => {
  if (!isemail.validate(email)) {
    throw new HttpErrors.UnprocessableEntity('Invalid email');
  }
};
