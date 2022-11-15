/* eslint-disable testing-library/no-render-in-setup */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { ActorCard } from "../../components";
import { mockActorCard } from "../../utils/db.mocks";
import { renderWithProviders } from "../../utils/test-utils";

describe("<ActorCard/>", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <ActorCard {...mockActorCard} />
      </BrowserRouter>
    );
  };
  afterEach(cleanup);

  test("should render actor name", () => {
    renderApp();
    const actorPropName = `${mockActorCard.actor.firstName} ${mockActorCard.actor.lastName}`; // Keanu Reeves

    const getNameElement = screen.getByText(actorPropName);
    expect(getNameElement).toBeInTheDocument();
  });

  test("should render actor image", () => {
    renderApp();
    const imageElement: HTMLImageElement = screen.getByAltText("actor");
    expect(imageElement.src).toEqual(mockActorCard.actor.image);
    expect(imageElement).toBeInTheDocument();
  });

  test("should render actor movies casted count", () => {
    renderApp();
    const castedMoviesCount = screen.getByTestId("castMoviesCount");
    expect(castedMoviesCount).toHaveTextContent("Casted 0 movie/s");
    expect(castedMoviesCount).toBeInTheDocument();
  });

  test("should navigate to individial actor page when clicked", () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <ActorCard {...mockActorCard} />
      </Router>
    );
    const linkElement = screen.getByRole("link");
    userEvent.click(linkElement);

    expect(history.location.pathname).toEqual(
      `/actor/${mockActorCard.actor.id}`
    );
  });
});
