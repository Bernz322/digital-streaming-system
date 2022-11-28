import { Carousel } from "@mantine/carousel";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MovieCard } from "../components";
import { fetchActorById } from "../features/actor/actorSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";
import { IDispatchResponse, IMovie } from "../utils/types";

function IndividualActor() {
  const { selectedActor, isLoading } = useTypedSelector((state) => state.actor);
  const dispatch = useTypedDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const actorFullName = `${selectedActor.firstName} ${selectedActor.lastName}`;
  const actorLink =
    selectedActor.link || `https://www.google.com/search?q=${actorFullName}`;
  useEffect(() => {
    dispatch(fetchActorById(id as string)).then((res: IDispatchResponse) => {
      if (res.error) navigate("/actors");
    });
  }, [dispatch, id, navigate]);

  return (
    <main className="pageContainer">
      <div className="sectionContainer">
        <div className="innerContainer">
          {isLoading ? (
            <h1 className="noContentH1">Please wait.</h1>
          ) : (
            <>
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
                      <p className="spanAge" data-testid="testActorAge">
                        {selectedActor.age}
                      </p>
                      <p className="spanLabel">Age</p>
                    </span>
                    <span>
                      <p className="spanGender" data-testid="testActorGender">
                        {selectedActor.gender}
                      </p>
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
                      {selectedActor?.moviesCasted?.map((movie: IMovie) => {
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
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default IndividualActor;
