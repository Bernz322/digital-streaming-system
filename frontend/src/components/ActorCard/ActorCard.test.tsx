import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ActorCard } from "..";
import { mockActorCard } from "../../utils/db.mocks";
import { renderWithProviders } from "../../utils/test-utils";

describe("Test Actor Card Component", () => {
  afterEach(cleanup);

  test("should render actor name", () => {
    renderWithProviders(
      <BrowserRouter>
        <ActorCard {...mockActorCard} />
      </BrowserRouter>
    );

    const actorPropName = `${mockActorCard.actor.firstName} ${mockActorCard.actor.lastName}`;

    const getNameElement = screen.getByText(actorPropName);
    expect(getNameElement).toBeInTheDocument();
  });

  test("should render actor image", () => {
    renderWithProviders(
      <BrowserRouter>
        <ActorCard {...mockActorCard} />
      </BrowserRouter>
    );

    const imageElement: HTMLImageElement = screen.getByAltText("actor");
    expect(imageElement.src).toEqual(mockActorCard.actor.image);
    expect(imageElement).toBeInTheDocument();
  });

  test("should move me to another route with complete actor details when clicked", () => {
    renderWithProviders(
      <BrowserRouter>
        <ActorCard {...mockActorCard} />
      </BrowserRouter>
    );

    const linkElement = screen.getByRole("link");
    userEvent.click(linkElement);

    expect(window.location.pathname).toEqual(
      `/actor/${mockActorCard.actor.id}`
    );
  });
});
