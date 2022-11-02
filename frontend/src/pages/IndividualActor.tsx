import { Carousel } from "@mantine/carousel";
import { MovieCard } from "../components";
import { IMovie } from "../utils/types";

const IndividualActor = () => {
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
        <div className="innerContainer">
          <div className="actorDetailsContainer">
            <img
              className="actorImg"
              src="https://m.media-amazon.com/images/M/MV5BMTA0ODI1ODk4NzdeQTJeQWpwZ15BbWU3MDkwNjkzOTY@._V1_.jpg"
              alt="actorImg"
            />
            <div className="actorContainer">
              <div className="actorProfile">Actor Profile</div>
              <h1 className="actorName">
                <a
                  href="https://www.imdb.com/name/nm0249291/?ref_=tt_ov_st"
                  target="_blank"
                  rel="noreferrer"
                >
                  Joel Edgerton
                </a>
              </h1>
              <div className="actorDetails">
                <span>
                  <p className="spanAge">48</p>
                  <p className="spanLabel">Age</p>
                </span>
                <span>
                  <p className="spanGender">Male</p>
                  <p className="spanLabel">Gender</p>
                </span>
              </div>
            </div>
          </div>
          <div className="movieActorsContainer">
            <h2 className="actorsPageH2">Movies Casted</h2>
            <h1 className="noContentH1">
              This actor has no movies casted yet.
            </h1>
            <div className="container">
              <Carousel
                mx="auto"
                sx={{ minWidth: 1200, maxWidth: 1200 }}
                loop
                slideGap="md"
              >
                {movies.map((movie) => {
                  return (
                    <Carousel.Slide size="25%" gap="xl" key={movie.id}>
                      <MovieCard movie={movie} />
                    </Carousel.Slide>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndividualActor;
