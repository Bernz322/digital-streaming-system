import { upperFirst } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { IActor } from "../../utils/types";
import "./ActorCard.scss";

export interface ActorProps {
  actor: IActor;
  isActorsPage: boolean;
}
const ActorCard = ({ actor, isActorsPage }: ActorProps) => {
  return (
    <div className="actorCardContainer">
      <Link to={`/actor/${actor.id}`} className="actorCardLink">
        <img src={actor.image} alt="actor" />
        <h4 className="actorCardName">
          {upperFirst(actor.firstName)} {upperFirst(actor.lastName)}
        </h4>
        {isActorsPage && (
          <p>Casted {actor?.moviesCasted?.toString() || 0} movie/s</p>
        )}
      </Link>
    </div>
  );
};

export default ActorCard;
