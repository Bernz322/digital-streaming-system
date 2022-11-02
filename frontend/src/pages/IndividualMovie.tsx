import { Carousel } from "@mantine/carousel";
import { Button, Rating, Textarea } from "@mantine/core";
import { useCallback, useState } from "react";
import { ActorCard, Rating as MyRating, ReviewCard } from "../components";
import { useTypedSelector } from "../hooks/rtk-hooks";
import { budgetFormatter } from "../utils/helpers";
import { IActor, IMovie } from "../utils/types";

const IndividualMovie = () => {
  const { loggedIn } = useTypedSelector((state) => state.auth);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(3);

  const handleMovieReviewSubmit = useCallback(() => {
    console.log({ reviewComment, reviewRating });
  }, [reviewComment, reviewRating]);

  const actors: IActor[] = [
    {
      id: "6360ea98e7653b1108a2397703",
      firstName: "Joel",
      lastName: "Edgerton",
      gender: "male",
      age: 48,
      image:
        "https://m.media-amazon.com/images/M/MV5BMTA0ODI1ODk4NzdeQTJeQWpwZ15BbWU3MDkwNjkzOTY@._V1_.jpg",
      link: "https://www.imdb.com/name/nm0249291/?ref_=tt_ov_st",
    },
    {
      id: "6360eac6e7653b1108a23197704",
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
      id: "6360eb32e7653b111108a97705",
      firstName: "Jada",
      lastName: "Alberts",
      gender: "female",
      age: 46,
      image:
        "https://m.media-amazon.com/images/M/MV5BYTY0ZTU1YTItMTgyZS00YzVhLTg1ZGQtMzlkYTBiYTExMDZjXkEyXkFqcGdeQXVyMjgzMDAyMjY@._V1_UY1200_CR84,0,630,1200_AL_.jpg",
      link: "https://www.imdb.com/name/nm3415084/?ref_=tt_ov_st",
      moviesCasted: 1,
    },
    {
      id: "6360ea98e7653b1108a1233977032",
      firstName: "Joel",
      lastName: "Edgerton",
      gender: "male",
      age: 48,
      image:
        "https://m.media-amazon.com/images/M/MV5BMTA0ODI1ODk4NzdeQTJeQWpwZ15BbWU3MDkwNjkzOTY@._V1_.jpg",
      link: "https://www.imdb.com/name/nm0249291/?ref_=tt_ov_st",
    },
    {
      id: "631260eac6e7653b1108a977042",
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
      id: "6360eb32e7333653b1108a977053",
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

  const movie: IMovie = {
    id: "6360eba7e7653b1108a97706",
    title: "The Stranger",
    description:
      "Two men who meet on a plane and strike up a conversation that turns into friendship. For Henry Teague, worn down by a lifetime of physical labour and crime, this is a dream come true.",
    image:
      "https://m.media-amazon.com/images/M/MV5BYzhmNWMyYjQtNTVlMC00MGUwLWFmYjEtM2NkNWY0ODQ2YmFiXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
    cost: 9000000,
    yearReleased: 2022,
  };
  return (
    <main className="pageContainer">
      <div className="sectionContainer">
        <div className="innerContainer">
          <div className="movieDetailsContainer">
            <div className="movieDetailsLeft">
              <img
                className="moviePoster"
                src={movie.image}
                alt={movie.title}
              />
            </div>
            <div className="movieDetailsRight">
              <h1 className="movieTitle">{movie.title}</h1>
              <div className="ratingContainer">
                <MyRating rating="5" />
              </div>
              <p className="movieDescription">{movie.description}</p>
              <p className="movieCost">
                <span>Budget Cost:</span>$ {budgetFormatter(movie.cost)}
              </p>
              <p className="movieYear">
                <span>Year released:</span>
                {movie.yearReleased}
              </p>
            </div>
          </div>
          <div className="movieActorsContainer">
            <h2 className="actorsPageH2">Actors/ Casts</h2>
            <h1 className="noContentH1">This movie has no actors/ casts.</h1>
            <div className="container">
              <Carousel
                mx="auto"
                sx={{ minWidth: 1200, maxWidth: 1200 }}
                loop
                slideGap="md"
              >
                {actors.map((actor) => {
                  return (
                    <Carousel.Slide size="25%" gap="xl" key={actor.id}>
                      <ActorCard actor={actor} />
                    </Carousel.Slide>
                  );
                })}
              </Carousel>
            </div>
          </div>
          <div className="movieReviewsContainer">
            <h2 className="reviewsPageH2">Reviews</h2>
            <h1 className="noContentH1">This movie has no user reviews yet.</h1>
            <div className="movieReviewForm">
              <Textarea
                className="movieReviewFormWidth"
                mr="sm"
                mb="md"
                description="Already seen this movie? How was it? Share what you think of it."
                placeholder='For starters you could say, "This is great!"'
                disabled={!loggedIn}
                label="Give your review to this movie."
                mt="md"
                radius="md"
                autosize
                minRows={2}
                onChange={(e) => setReviewComment(e.target.value)}
              />
              <Rating
                defaultValue={3}
                onChange={(value) => setReviewRating(value)}
              />
              <Button
                className={`movieReviewFormWidth ${
                  !loggedIn && "disabledButton"
                }`}
                mt="md"
                disabled={!loggedIn}
                color="white"
                onClick={handleMovieReviewSubmit}
              >
                {!loggedIn ? "Please login to submit review" : "Submit Review"}
              </Button>
            </div>
            <div className="container">
              <ReviewCard />
              <ReviewCard />
              <ReviewCard />
              <ReviewCard />
              <ReviewCard />
              <ReviewCard />
              <ReviewCard />
              <ReviewCard />
              <ReviewCard />
              <ReviewCard />
              <ReviewCard />
              <ReviewCard />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndividualMovie;
