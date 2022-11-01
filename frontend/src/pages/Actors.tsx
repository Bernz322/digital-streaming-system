import { ActorCard } from "../components";
import { IActor } from "../utils/types";

const Actors = () => {
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
    <main className="pageContainer">
      <div className="sectionContainer">
        <div className="innerContainer">
          <div className="container">
            {actors.map((actor) => {
              return <ActorCard actor={actor} key={actor.id} />;
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Actors;
