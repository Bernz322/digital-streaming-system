import {SchemaObject} from '@loopback/openapi-v3';

export const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  title: 'Response',
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};
