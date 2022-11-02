import { Rating } from "..";
import "./ReviewCard.scss";

const ReviewCard = () => {
  return (
    <div className="reviewCardContainer">
      <h4>User One</h4>
      <div className="reviewBottom">
        <div className="ratingContainer">
          <Rating rating={5} />
        </div>
        <p className="review">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem
          cupiditate eaque ab dolore? Libero, ipsa! Molestiae provident ex in
          deserunt cum, iusto qui at consequuntur similique rem blanditiis,
          aspernatur voluptatum.
        </p>
        <h3>
          <span>Reviewed on: </span> November 18, 2022
        </h3>
      </div>
    </div>
  );
};

export default ReviewCard;
