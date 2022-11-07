// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import * as ResizeObserverModule from "resize-observer-polyfill";
// src/setupTests.js
import { server } from "./mocks/server";
// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

// https://www.appsloveworld.com/reactjs/100/7/how-to-mock-resizeobserver-to-work-in-unit-tests-using-react-testing-library
(global as any).ResizeObserver = ResizeObserverModule.default;
