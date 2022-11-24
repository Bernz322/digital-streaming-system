import { useCallback, useEffect, useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { ActorCard } from "../components";
import {
  fetchAllActors,
  fetchSearchedActors,
} from "../features/actor/actorSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";

function Actors() {
  const { actors, isLoading } = useTypedSelector((state) => state.actor);
  const dispatch = useTypedDispatch();
  const [actorName, setActorName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchAllActors());
  }, [dispatch]);

  const handleSearchClick = useCallback(() => {
    if (actorName.trim() === "") return setError(true);
    return dispatch(fetchSearchedActors(actorName));
  }, [dispatch, actorName]);
  return (
    <main className="pageContainer">
      <div className="sectionContainer">
        <div className="search">
          <TextInput
            icon={<IconSearch />}
            placeholder="Find actor"
            className="searchInput"
            error={actorName.trim() === "" && error && "Enter actor name"}
            value={actorName}
            onChange={(e) => setActorName(e.target.value)}
          />
          <Button onClick={() => handleSearchClick()}>Search Actor</Button>
        </div>
        <div className="innerContainer">
          <h1 className="actorsPageH1">Actors</h1>
          {isLoading ? (
            <h1 className="noContentH1">Please wait.</h1>
          ) : (
            actors.length <= 0 && (
              <h1 className="noContentH1">There are no actors available.</h1>
            )
          )}
          <div className="container">
            {actors.map((actor) => {
              return (
                !isLoading && (
                  <ActorCard actor={actor} key={actor.id} isActorsPage />
                )
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Actors;
