/* eslint-disable testing-library/no-render-in-setup */
import { cleanup, screen } from "@testing-library/react";
import dayjs from "dayjs";
import { BrowserRouter } from "react-router-dom";
import { ReviewCard } from "../../components";
import renderWithProviders from "../../utils/test-utils";
import { IMovieReview } from "../../utils/types";

const movieReview: IMovieReview = {
  id: "112asd",
  description: "Good movie!",
  rating: 5,
  datePosted: "11-03-2022",
  isApproved: true,
  movieId: "2",
  userId: "3",
  userReviewer: {
    id: "3",
    firstName: "User",
    lastName: "Reviewer",
    email: "user@reviewer.com",
  },
};

describe("<ReviewCard />", () => {
  const renderApp = () => {
    return renderWithProviders(
      <BrowserRouter>
        <ReviewCard review={movieReview} />
      </BrowserRouter>
    );
  };

  beforeEach(() => renderApp());
  afterEach(cleanup);

  test("should render reviewer full name", () => {
    const reviewerPropName = `${movieReview.userReviewer?.firstName} ${movieReview.userReviewer?.lastName}`;

    const nameElement = screen.getByRole("heading", { level: 4 });
    expect(nameElement).toHaveTextContent(reviewerPropName); // User Reviewer
  });

  test("should render review description", () => {
    const descElement = screen.getByTestId("reviewCardDescription");
    expect(descElement).toHaveTextContent(movieReview.description); // Good movie!
  });

  test("should render review posted date", () => {
    const dateElement = screen.getByRole("heading", { level: 3 });
    expect(dateElement).toHaveTextContent(
      `Reviewed on: ${dayjs(movieReview.datePosted).format("DD-MM-YYYY")}`
    );
  });
});
