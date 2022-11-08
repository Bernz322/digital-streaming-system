/* eslint-disable testing-library/no-render-in-setup */
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
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

  beforeEach(() => renderApp());
  afterEach(cleanup);

  test("should render actor name", () => {
    const actorPropName = `${mockActorCard.actor.firstName} ${mockActorCard.actor.lastName}`; // Keanu Reeves

    const getNameElement = screen.getByText(actorPropName);
    expect(getNameElement).toBeInTheDocument();
  });

  test("should render actor image", () => {
    const imageElement: HTMLImageElement = screen.getByAltText("actor");
    expect(imageElement.src).toEqual(mockActorCard.actor.image);
    expect(imageElement).toBeInTheDocument();
  });

  test("should navigate to individial actor page when clicked", () => {
    const linkElement = screen.getByRole("link");
    userEvent.click(linkElement);

    expect(window.location.pathname).toEqual(
      `/actor/${mockActorCard.actor.id}`
    );
  });
});
