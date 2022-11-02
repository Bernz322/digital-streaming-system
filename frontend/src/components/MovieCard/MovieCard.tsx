import { Link } from "react-router-dom";
import { Rating } from "..";
import { IMovie } from "../../utils/types";
import "./MovieCard.scss";

interface MovieProps {
  movie: IMovie;
}

const MovieCard = ({ movie }: MovieProps) => {
  return (
    <div className="movieCardContainer">
      <Link to={`/movie/${movie.id}`} className="movieCardLink">
        <img src={movie.image} alt="movie" />
        <Rating rating="5" />
        <h4 className="movieCardTitle">{movie.title}</h4>
        <div className="movieCardFooter">
          <span>Year released</span>
          <span>{movie.yearReleased}</span>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
