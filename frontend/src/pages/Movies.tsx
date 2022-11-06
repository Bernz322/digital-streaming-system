import { useCallback, useEffect, useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { MovieCard } from "../components";
import {
  fetchAllMovies,
  fetchSearchedMovies,
} from "../features/movie/movieSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";

const Movies = () => {
  const { movies, isLoading } = useTypedSelector((state) => state.movie);
  const dispatch = useTypedDispatch();
  const [movieName, setMovieName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchAllMovies());
  }, [dispatch]);

  const handleSearchClick = useCallback(() => {
    if (movieName.trim() === "") return setError(true);
    dispatch(fetchSearchedMovies(movieName));
  }, [dispatch, movieName]);

  return (
    <main className="pageContainer">
      <div className="sectionContainer">
        <div className="search">
          <TextInput
            icon={<IconSearch />}
            placeholder="Find movie"
            className="searchInput"
            error={movieName.trim() === "" && error && "Enter movie name"}
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
          />
          <Button onClick={() => handleSearchClick()}>Search Movie</Button>
        </div>
        <div className="innerContainer">
          <h1 className="moviesPageH1">Movies</h1>
          {isLoading ? (
            <h1 className="noContentH1">Please wait.</h1>
          ) : (
            movies.length <= 0 && (
              <h1 className="noContentH1">There are no movies available.</h1>
            )
          )}
          <div className="container">
            {movies.map((movie) => {
              return !isLoading && <MovieCard movie={movie} key={movie.id} />;
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Movies;
