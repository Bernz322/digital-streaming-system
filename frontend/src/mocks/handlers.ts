import { rest } from "msw";
import { baseAPIUrl } from "../utils/apiCalls";
import {
  mockActors,
  mockMovies,
  mockSearchedActor,
  mockSearchedMovies,
} from "../utils/db.mocks";

export const handlers = [
  rest.get(`${baseAPIUrl}/movies`, (req, res, ctx) => {
    return res(
      ctx.json({
        status: "success",
        data: mockMovies,
        message: "Successfully fetched all movies.",
      }),
      ctx.delay(150)
    );
  }),
  rest.get(`/search/movies/:title`, (req, res, ctx) => {
    const { title } = req.params;
    switch (title) {
      case "john": {
        return res(
          ctx.json({
            status: "success",
            data: mockSearchedMovies,
            message: "Successfully fetched movies.",
          }),
          ctx.delay(150)
        );
      }
      case "o": {
        return res(
          ctx.json({
            status: "success",
            data: mockMovies,
            message: "Successfully fetched movies.",
          }),
          ctx.delay(150)
        );
      }
      case "asdfghjkl;": {
        return res(
          ctx.json({
            status: "success",
            data: [],
            message: "Successfully fetched movies.",
          }),
          ctx.delay(150)
        );
      }
      default:
        return res(
          ctx.json({
            status: "fail",
            data: [],
            message: "Failed fetching movies.",
          }),
          ctx.delay(150)
        );
    }
  }),
  rest.get(`${baseAPIUrl}/actors`, (req, res, ctx) => {
    return res(
      ctx.json({
        status: "success",
        data: mockActors,
        message: "Successfully fetched all actors in the database..",
      }),
      ctx.delay(150)
    );
  }),
  rest.get(`/search/actors/:name`, (req, res, ctx) => {
    const { name } = req.params;
    switch (name) {
      case "keanu": {
        return res(
          ctx.json({
            status: "success",
            data: mockSearchedActor,
            message: "Successfully fetched actor data.",
          }),
          ctx.delay(150)
        );
      }
      case "asdfghjkl;": {
        return res(
          ctx.json({
            status: "success",
            data: [],
            message: "Successfully fetched actor data.",
          }),
          ctx.delay(150)
        );
      }
      default:
        return res(
          ctx.json({
            status: "fail",
            data: [],
            message: "Failed fetching movies.",
          }),
          ctx.delay(150)
        );
    }
  }),
];
