import { Button, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";
import { ActorCard } from "../components";
import {
  fetchAllActors,
  fetchSearchedActors,
} from "../features/actor/actorSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";

const Actors = () => {
  const { actors } = useTypedSelector((state) => state.actor);
  const dispatch = useTypedDispatch();
  const [actorName, setActorName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchAllActors());
  }, [dispatch]);

  const handleSearchClick = () => {
    if (actorName === "") return setError(true);
    dispatch(fetchSearchedActors(actorName));
  };
  return (
    <main className="pageContainer">
      <div className="sectionContainer">
        <div className="search">
          <TextInput
            icon={<IconSearch />}
            placeholder="Find actor"
            className="searchInput"
            error={actorName === "" && error && "Enter actor name"}
            value={actorName}
            onChange={(e) => setActorName(e.target.value)}
          />
          <Button onClick={() => handleSearchClick()}>Search Actor</Button>
        </div>
        <div className="innerContainer">
          <h1 className="actorsPageH1">Actors</h1>
          {actors.length <= 0 && (
            <h1 className="noContentH1">There are no actors available.</h1>
          )}
          <div className="container">
            {actors.map((actor) => {
              return (
                <ActorCard actor={actor} key={actor.id} isActorsPage={true} />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Actors;
