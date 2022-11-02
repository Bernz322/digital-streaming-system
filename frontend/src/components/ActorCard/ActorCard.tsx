import { Link } from "react-router-dom";
import { IActor } from "../../utils/types";
import "./ActorCard.scss";

interface ActorProps {
  actor: IActor;
}
const ActorCard = ({ actor }: ActorProps) => {
  return (
    <div className="actorCardContainer">
      <Link to={`/actor/${actor.id}`} className="actorCardLink">
        <img src={actor.image} alt="actor" />
        <h4 className="actorCardName">
          {actor.firstName} {actor.lastName}
        </h4>
        <p>Casted {actor.moviesCasted || 0} movies</p>
      </Link>
    </div>
  );
};

export default ActorCard;
