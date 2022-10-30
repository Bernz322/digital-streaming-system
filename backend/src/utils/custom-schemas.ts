import {SchemaObject} from '@loopback/openapi-v3';

// User Controller Custom Schemas
export const UserLoginSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  title: 'Login user',
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
  },
};

// Actors Controller Custom Schemas

// Movies Controller Custom Schemas

// Movie Casts Controller Custom Schemas

// Reviews Controller Custom Schemas
