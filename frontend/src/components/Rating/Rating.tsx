import "./Rating.scss";

interface RatingProps {
  rating: number;
}

function Rating({ rating }: RatingProps) {
  return (
    <div className="movieRatingContainer">
      <p className="ratingTitle">Rating</p>
      <div className="movieRating">
        <p className="ratingValue" data-testid="testMovieRating">
          {rating}/5
        </p>
        <i className="fa fa-star" aria-hidden="true" />
      </div>
    </div>
  );
}

export default Rating;
