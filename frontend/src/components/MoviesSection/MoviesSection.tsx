import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MovieCard } from "..";
import { fetchLimitMovies } from "../../features/movie/movieSlice";
import { useTypedDispatch, useTypedSelector } from "../../hooks/rtk-hooks";

function MoviesSection() {
  const { movies, isLoading } = useTypedSelector((state) => state.movie);
  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(fetchLimitMovies(10));
  }, [dispatch]);

  return (
    <div className="sectionContainer">
      <div className="innerContainer">
        <div className="sectionTop">
          <h1>
            <Link to="movies">Movies Library</Link>
          </h1>
          <h2>
            <Link className="seeAll" to="movies">
              See all
            </Link>
          </h2>
        </div>
        {isLoading && movies.length <= 0 ? (
          <h1 className="noContentH1">Please wait.</h1>
        ) : (
          movies.length <= 0 && (
            <h1 className="noContentH1">There are no movies available.</h1>
          )
        )}
        <div className="container" data-testid="movieCardContainer">
          {movies.map((movie) => {
            return <MovieCard movie={movie} key={movie.id} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default MoviesSection;
