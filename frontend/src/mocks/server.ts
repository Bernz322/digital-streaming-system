import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// The server of Mock Service Provider to be run during tests
// It takes in all API interceptors (handlers)
export const server = setupServer(...handlers);
