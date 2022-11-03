import { Carousel } from "@mantine/carousel";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MovieCard } from "../components";
import { fetchActorById } from "../features/actor/actorSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";

const IndividualActor = () => {
  const { selectedActor } = useTypedSelector((state) => state.actor);
  const dispatch = useTypedDispatch();
  const { id } = useParams();
  const actorFullName = `${selectedActor.firstName} ${selectedActor.lastName}`;
  const actorLink =
    selectedActor.link || `https://www.google.com/search?q=${actorFullName}`;
  useEffect(() => {
    dispatch(fetchActorById(id as string));
  }, [dispatch, id]);

  return (
    <main className="pageContainer">
      <div className="sectionContainer">
        <div className="innerContainer">
          <div className="actorDetailsContainer">
            <img
              className="actorImg"
              src={selectedActor.image}
              alt="actorImg"
            />
            <div className="actorContainer">
              <div className="actorProfile">Actor Profile</div>
              <h1 className="actorName">
                <a href={actorLink} target="_blank" rel="noreferrer">
                  {actorFullName}
                </a>
              </h1>
              <div className="actorDetails">
                <span>
                  <p className="spanAge">{selectedActor.age}</p>
                  <p className="spanLabel">Age</p>
                </span>
                <span>
                  <p className="spanGender">{selectedActor.gender}</p>
                  <p className="spanLabel">Gender</p>
                </span>
              </div>
            </div>
          </div>
          <div className="movieActorsContainer">
            <h2 className="actorsPageH2">Movies Casted</h2>
            {!selectedActor.moviesCasted && (
              <h1 className="noContentH1">
                This actor has no movies casted yet.
              </h1>
            )}
            {selectedActor?.moviesCasted && (
              <div className="container">
                <Carousel
                  mx="auto"
                  sx={{ minWidth: 1200, maxWidth: 1200 }}
                  loop
                  slideGap="md"
                  align="start"
                >
                  {selectedActor?.moviesCasted?.map((movie: any) => {
                    return (
                      <Carousel.Slide size="25%" gap="xl" key={movie.id}>
                        <MovieCard movie={movie} />
                      </Carousel.Slide>
                    );
                  })}
                </Carousel>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndividualActor;
