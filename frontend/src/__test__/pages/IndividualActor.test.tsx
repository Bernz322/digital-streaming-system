/* eslint-disable testing-library/no-render-in-setup */
import {
  cleanup,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { renderWithProviders } from "../../utils/test-utils";
import { IndividualActor } from "../../pages";

describe("<IndividualActor />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <IndividualActor />
      </BrowserRouter>
    );
  };
  afterEach(() => cleanup);

  test("should render loading element", async () => {
    renderApp();
    const loadingElement = await screen.findByRole("heading", { level: 1 });

    expect(loadingElement).toHaveTextContent("Please wait");
    expect(loadingElement).toBeInTheDocument();
  });

  test("should render actor details", async () => {
    const { store } = renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    // Navigating IndividualActor Page will populate selectedActor state in actorSlice
    const actorFromSelector = store.getState().actor.selectedActor;
    const fullName = `${actorFromSelector.firstName} ${actorFromSelector.lastName}`;

    const imageElement: HTMLImageElement = screen.getByAltText("actorImg");
    const nameElement = screen.getByRole("heading", { level: 1 });
    const ageElement = screen.getByTestId("testActorAge");
    const genderElement = screen.getByTestId("testActorGender");

    expect(imageElement).toBeInTheDocument();
    expect(nameElement).toBeInTheDocument();
    expect(ageElement).toBeInTheDocument();
    expect(genderElement).toBeInTheDocument();

    expect(imageElement.src).toEqual(actorFromSelector.image);
    expect(nameElement.textContent).toEqual(fullName);
    expect(ageElement.textContent).toEqual(actorFromSelector.age.toString());
    expect(genderElement.textContent).toContain(actorFromSelector.gender);
  });

  test("should render actor movies", async () => {
    const { store } = renderApp();
    await waitForElementToBeRemoved(() => screen.queryByText("Please wait."));

    const actorFromSelector = store.getState().actor.selectedActor;
    const moviesCastedLength = actorFromSelector.moviesCasted?.length;

    expect(screen.getAllByRole("img", { name: "movie" }).length).toBe(
      moviesCastedLength
    );
    expect(screen.getAllByText(/john wick/i).length).toEqual(2);
    expect(screen.getByText(/Chapter 2/i)).toBeInTheDocument();
  });
});
