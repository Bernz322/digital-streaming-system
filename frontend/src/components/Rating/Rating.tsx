import "./Rating.scss";

interface RatingProps {
  rating: string;
}

const Rating = ({ rating }: RatingProps) => {
  return (
    <div className="movieRatingContainer">
      <p className="ratingTitle">Rating</p>
      <div className="movieRating">
        <p className="ratingValue">{rating}/5</p>
        <i className="fa fa-star" aria-hidden="true"></i>
      </div>
    </div>
  );
};

export default Rating;
