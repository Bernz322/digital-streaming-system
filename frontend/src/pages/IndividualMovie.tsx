import { Carousel } from "@mantine/carousel";
import { Button, Rating, Textarea } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActorCard, Rating as MyRating, ReviewCard } from "../components";
import { fetchMovieById, postMovieReview } from "../features/movie/movieSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";
import { budgetFormatter } from "../utils/helpers";
import { IDispatchResponse } from "../utils/types";

const IndividualMovie = () => {
  const { loggedIn } = useTypedSelector((state) => state.auth);
  const { selectedMovie, isLoading } = useTypedSelector((state) => state.movie);
  const dispatch = useTypedDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(3);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchMovieById(id as string)).then((res: IDispatchResponse) => {
      if (res.error) navigate("/movies");
    });
  }, [dispatch, id, navigate]);

  const handleMovieReviewSubmit = useCallback(async () => {
    if (reviewComment.trim() === "") return setError(true);
    const reviewData = {
      description: reviewComment.trim(),
      rating: reviewRating,
      movieId: id as string,
    };
    const res: IDispatchResponse = await dispatch(postMovieReview(reviewData));
    if (!res.error) setReviewComment("");
  }, [reviewComment, reviewRating, id, dispatch]);

  const approvedReviews = selectedMovie?.movieReviews?.filter((review) => {
    return review.isApproved;
  });

  return (
    <main className="pageContainer">
      <div className="sectionContainer">
        <div className="innerContainer">
          {isLoading ? (
            <h1 className="noContentH1">Please wait.</h1>
          ) : (
            <div className="movieDetailsContainer">
              <div className="movieDetailsLeft">
                <img
                  className="moviePoster"
                  src={selectedMovie?.image}
                  alt={selectedMovie?.title}
                />
              </div>
              <div className="movieDetailsRight">
                <h1 className="movieTitle">{selectedMovie?.title}</h1>
                <div className="ratingContainer">
                  <MyRating rating={selectedMovie.rating as number} />
                </div>
                <p className="movieDescription" data-testid="testMovieDesc">
                  {selectedMovie?.description}
                </p>
                <p className="movieCost" data-testid="testMovieCost">
                  <span>Budget Cost:</span>${" "}
                  {budgetFormatter(selectedMovie?.cost)}
                </p>
                <p className="movieYear" data-testid="testMovieYearReleased">
                  <span>Year released:</span>
                  {selectedMovie?.yearReleased}
                </p>
              </div>
            </div>
          )}
          <div className="movieActorsContainer">
            <h2 className="actorsPageH2">Actors/ Casts</h2>
            {(selectedMovie?.movieCasters &&
              selectedMovie?.movieCasters.length <= 0) ||
              (!selectedMovie?.movieCasters && (
                <h1 className="noContentH1">
                  This movie has no actors/ casts.
                </h1>
              ))}
            {selectedMovie?.movieCasters && (
              <div className="container">
                <Carousel
                  mx="auto"
                  sx={{ minWidth: 1200, maxWidth: 1200 }}
                  loop
                  slideGap="md"
                  align="start"
                >
                  {selectedMovie?.movieCasters?.map((actor) => {
                    return (
                      <Carousel.Slide size="25%" gap="xl" key={actor?.id}>
                        <ActorCard actor={actor} isActorsPage={false} />
                      </Carousel.Slide>
                    );
                  })}
                </Carousel>
              </div>
            )}
          </div>
          <div className="movieReviewsContainer">
            <h2 className="reviewsPageH2">Reviews</h2>
            {((approvedReviews && approvedReviews?.length <= 0) ||
              !approvedReviews) && (
              <h1 className="noContentH1">
                This movie has no user reviews yet.
              </h1>
            )}

            <div className="movieReviewForm">
              <Textarea
                data-testid="reviewTextArea"
                className="movieReviewFormWidth"
                mr="sm"
                mb="md"
                description="Already seen this movie? How was it? Share what you think of it."
                placeholder='For starters you could say, "This is great!"'
                disabled={!loggedIn}
                label="Give your review to this movie."
                mt="md"
                radius="md"
                autosize
                minRows={2}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                error={
                  reviewComment.trim() === "" &&
                  error &&
                  "Please enter your review."
                }
              />
              <Rating
                defaultValue={3}
                onChange={(value) => setReviewRating(value)}
                data-testid="reviewStars"
              />
              <Button
                className={`movieReviewFormWidth ${
                  !loggedIn && "disabledButton"
                }`}
                mt="md"
                disabled={!loggedIn}
                color="white"
                onClick={handleMovieReviewSubmit}
              >
                {!loggedIn ? "Please login to submit review" : "Submit Review"}
              </Button>
            </div>
            <div className="container">
              {approvedReviews?.map((review) => {
                return <ReviewCard review={review} key={review.id} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndividualMovie;
