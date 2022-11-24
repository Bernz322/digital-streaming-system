import { upperFirst } from "@mantine/hooks";
import dayjs from "dayjs";
import { Rating } from "..";
import { IMovieReview } from "../../utils/types";
import "./ReviewCard.scss";

interface IReviewCardProps {
  review: IMovieReview;
}

function ReviewCard({ review }: IReviewCardProps) {
  const reviewerFullName = `${review?.userReviewer?.firstName} ${review?.userReviewer?.lastName}`;
  return (
    <div className="reviewCardContainer">
      <h4>{upperFirst(reviewerFullName)}</h4>
      <div className="reviewBottom">
        <div className="ratingContainer">
          <Rating rating={review.rating} />
        </div>
        <p className="review" data-testid="reviewCardDescription">
          {review.description}
        </p>
        <h3>
          <span>Reviewed on: </span>
          {dayjs(review.datePosted).format("DD-MM-YYYY")}
        </h3>
      </div>
    </div>
  );
}

export default ReviewCard;
