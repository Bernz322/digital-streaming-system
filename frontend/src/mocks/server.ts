// eslint-disable-next-line import/no-extraneous-dependencies
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// The server of Mock Service Provider to be run during tests
// It takes in all API interceptors (handlers)
// eslint-disable-next-line import/prefer-default-export
export const server = setupServer(...handlers);
