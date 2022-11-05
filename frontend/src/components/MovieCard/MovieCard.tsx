import { upperFirst } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { Rating } from "..";
import { movieRating } from "../../utils/helpers";
import { IMovie, IMovieReview } from "../../utils/types";
import "./MovieCard.scss";

interface MovieProps {
  movie: IMovie;
}

const MovieCard = ({ movie }: MovieProps) => {
  const rating: number = movieRating(movie.movieReviews as IMovieReview[]);

  return (
    <div className="movieCardContainer">
      <Link to={`/movie/${movie.id}`} className="movieCardLink">
        <img src={movie.image} alt="movie" />
        <Rating rating={rating} />
        <h4 className="movieCardTitle">{upperFirst(movie.title)}</h4>
        <div className="movieCardFooter">
          <span>Year released</span>
          <span>{movie.yearReleased}</span>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
