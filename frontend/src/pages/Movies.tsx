import { Button, Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useEffect } from "react";
import { MovieCard } from "../components";
import { fetchMovies } from "../features/movie/movieSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";

const Movies = () => {
  const { movies } = useTypedSelector((state) => state.movie);
  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);
  return (
    <main className="pageContainer">
      <div className="sectionContainer">
        <div className="search">
          <Input
            icon={<IconSearch />}
            placeholder="Find movie"
            className="searchInput"
          />
          <Button>Search Movie</Button>
        </div>
        <div className="innerContainer">
          <h1 className="moviesPageH1">Movies</h1>
          {movies.length <= 0 && (
            <h1 className="noContentH1">There are no movies available.</h1>
          )}
          <div className="container">
            {movies.map((movie) => {
              return <MovieCard movie={movie} key={movie.id} />;
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Movies;
