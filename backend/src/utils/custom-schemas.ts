import {SchemaObject} from '@loopback/openapi-v3';

// API Response Schema
export const CustomResponseSchema: SchemaObject = {
  type: 'object',
  'x-ts-type': 'Response',
  title: 'Response',
  properties: {
    status: {
      type: 'string',
      enum: ['success', 'fail'],
    },
    data: {
      type: 'object',
    },
    message: {
      type: 'string',
    },
  },
};

// User Controller Custom Schemas
export const UserLoginSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  title: 'Login user',
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
};

// Movies Controller Custom Schemas
export const PostMovieSchema: SchemaObject = {
  type: 'object',
  required: ['title', 'cost', 'yearReleased'],
  title: 'Create new Movie',
  properties: {
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    cost: {
      type: 'number',
    },
    yearReleased: {
      type: 'number',
    },
    image: {
      type: 'string',
    },
    actors: {
      type: 'array',
      default: [],
    },
  },
};
