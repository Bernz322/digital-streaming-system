import {
  cleanup,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Actors } from "../../pages";
import renderWithProviders from "../../utils/test-utils";
import { mockActors, mockSearchedActor } from "../../utils/db.mocks";
import { IActor } from "../../utils/types";

describe("<Actors />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <Actors />
      </BrowserRouter>
    );
  };
  afterEach(cleanup);

  test("should render search input", () => {
    renderApp();

    const searchInputElement = screen.getByRole("textbox");
    expect(searchInputElement).toBeInTheDocument();
  });

  test("should render search button", () => {
    renderApp();

    const searchBtnElement = screen.getByRole("button");
    expect(searchBtnElement).toBeInTheDocument();
  });

  test("should render all mocked actors", async () => {
    const { store } = renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    expect(screen.getAllByRole("img", { name: "actor" }).length).toBe(
      mockActors.length
    );
    expect(store.getState().actor.actors.length).toEqual(mockActors.length);
    expect(store.getState().actor.actors).toEqual(mockActors);
  });

  test('should not render "There are no actors available"', async () => {
    renderApp();

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));
    const noMovieElement = screen.getAllByRole("heading", { level: 1 });
    expect(noMovieElement.length).toEqual(1);
  });

  test('should render "There are no actors available"', async () => {
    renderWithProviders(
      <BrowserRouter>
        <Actors />
      </BrowserRouter>,
      {
        preloadedState: {
          actor: {
            isLoading: false,
            actors: [],
            selectedActor: {} as IActor,
          },
        },
      }
    );
    const noMovieElement = screen.getAllByRole("heading", { level: 1 });
    expect(noMovieElement[1]).toBeInTheDocument();
  });

  test("should be able to type a text", () => {
    renderApp();

    const toSearchValue = "Keanu";
    const searchInputElement: HTMLInputElement = screen.getByRole("textbox");
    userEvent.type(searchInputElement, toSearchValue);
    expect(searchInputElement.value).toBe(toSearchValue);
  });

  test("should show empty field alert message", () => {
    renderApp();

    const searchInputElement: HTMLInputElement = screen.getByRole("textbox");
    const searchBtnElement = screen.getByRole("button");
    userEvent.type(searchInputElement, " ");
    userEvent.click(searchBtnElement);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  test("should show searched actors card", async () => {
    const { store } = renderApp();
    // Fetch and render all actors first
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    expect(screen.getAllByRole("img", { name: "actor" }).length).toBe(
      mockActors.length
    );

    // Perform search actor
    const searchInputElement: HTMLInputElement = screen.getByRole("textbox");
    const searchBtnElement = screen.getByRole("button");
    userEvent.type(searchInputElement, "keanu");
    userEvent.click(searchBtnElement);

    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    // Render all actor cards from mock data. In this case, only one Actor (Keanu)
    expect(screen.getAllByRole("img", { name: "actor" }).length).toBe(1);
    expect(store.getState().actor.actors.length).toEqual(
      mockSearchedActor.length
    );
    expect(store.getState().actor.actors).toEqual(mockSearchedActor);
  });
});
