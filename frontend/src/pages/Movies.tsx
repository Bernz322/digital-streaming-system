import { Button, Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { MovieCard } from "../components";
import { IMovie } from "../utils/types";

const Movies = () => {
  const movies: IMovie[] = [
    {
      id: "635e5996846c644b3849f71c",
      title: "test movie",
      description: "Test only.",
      image:
        "https://www.pacifictrellisfruit.com/wp-content/uploads/2016/04/default-placeholder-300x300.png",
      cost: 150000,
      yearReleased: 2015,
    },
    {
      id: "635e59aa846c644b3849f71d",
      title: "test movie3",
      description: "Test only 3.",
      image:
        "https://www.pacifictrellisfruit.com/wp-content/uploads/2016/04/default-placeholder-300x300.png",
      cost: 120000,
      yearReleased: 2012,
    },
    {
      id: "6360eba7e7653b1108a97706",
      title: "The Stranger",
      description:
        "Two men who meet on a plane and strike up a conversation that turns into friendship. For Henry Teague, worn down by a lifetime of physical labour and crime, this is a dream come true.",
      image:
        "https://m.media-amazon.com/images/M/MV5BYzhmNWMyYjQtNTVlMC00MGUwLWFmYjEtM2NkNWY0ODQ2YmFiXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
      cost: 9000000,
      yearReleased: 2022,
    },
    {
      id: "6360eba7e7653b1108a977061",
      title: "The Stranger",
      description:
        "Two men who meet on a plane and strike up a conversation that turns into friendship. For Henry Teague, worn down by a lifetime of physical labour and crime, this is a dream come true.",
      image:
        "https://m.media-amazon.com/images/M/MV5BYzhmNWMyYjQtNTVlMC00MGUwLWFmYjEtM2NkNWY0ODQ2YmFiXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
      cost: 9000000,
      yearReleased: 2022,
    },
    {
      id: "6360eba7e7653b1108a977062",
      title: "The Stranger",
      description:
        "Two men who meet on a plane and strike up a conversation that turns into friendship. For Henry Teague, worn down by a lifetime of physical labour and crime, this is a dream come true.",
      image:
        "https://m.media-amazon.com/images/M/MV5BYzhmNWMyYjQtNTVlMC00MGUwLWFmYjEtM2NkNWY0ODQ2YmFiXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
      cost: 9000000,
      yearReleased: 2022,
    },
  ];
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
          <h1 className="noContentH1">There are no movies available.</h1>
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
