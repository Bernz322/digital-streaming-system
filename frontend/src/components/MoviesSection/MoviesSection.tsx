import { Link } from "react-router-dom";
import { ActorCard, MovieCard } from "..";
import { IActor, IMovie } from "../../utils/types";
import "./MoviesSection.scss";

const MoviesSection = () => {
  // Fetch all movies available here
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

  const actors: IActor[] = [
    {
      id: "6360ea98e7653b1108a97703",
      firstName: "Joel",
      lastName: "Edgerton",
      gender: "male",
      age: 48,
      image:
        "https://m.media-amazon.com/images/M/MV5BMTA0ODI1ODk4NzdeQTJeQWpwZ15BbWU3MDkwNjkzOTY@._V1_.jpg",
      link: "https://www.imdb.com/name/nm0249291/?ref_=tt_ov_st",
    },
    {
      id: "6360eac6e7653b1108a97704",
      firstName: "Sean",
      lastName: "Harris",
      gender: "male",
      age: 48,
      image:
        "https://m.media-amazon.com/images/M/MV5BMTM3NTI1NzI4MF5BMl5BanBnXkFtZTcwODU1MTg4Nw@@._V1_.jpg",
      link: "https://www.imdb.com/name/nm0365317/?ref_=tt_ov_st",
      moviesCasted: 3,
    },
    {
      id: "6360eb32e7653b1108a97705",
      firstName: "Jada",
      lastName: "Alberts",
      gender: "female",
      age: 46,
      image:
        "https://m.media-amazon.com/images/M/MV5BYTY0ZTU1YTItMTgyZS00YzVhLTg1ZGQtMzlkYTBiYTExMDZjXkEyXkFqcGdeQXVyMjgzMDAyMjY@._V1_UY1200_CR84,0,630,1200_AL_.jpg",
      link: "https://www.imdb.com/name/nm3415084/?ref_=tt_ov_st",
      moviesCasted: 1,
    },
  ];
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
        <div className="container">
          {movies.map((movie) => {
            return <MovieCard movie={movie} key={movie.id} />;
          })}
          {actors.map((actor) => {
            return <ActorCard actor={actor} key={actor.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default MoviesSection;
