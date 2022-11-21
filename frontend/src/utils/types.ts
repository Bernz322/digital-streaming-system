export interface ILoginResponse {
  status: string;
  data: {
    token: string;
  };
  message: string;
}
export interface IUserLogin {
  id: string;
  name: string;
  email: string;
  role: string;
  isActivated: boolean;
}
export interface IRegisterAPIProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface IPatchUserAPIProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActivated: boolean;
}
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActivated: boolean | string;
  dateCreated: string;
}
export interface IMovie {
  id: string;
  title: string;
  description: string;
  image: string;
  cost: number;
  yearReleased: number;
  movieReviews?: IMovieReview[];
  movieCasters?: IActor[];
  rating?: number;
}
export interface IPostMovie {
  title: string;
  description: string;
  cost: number;
  yearReleased: number;
  image: string;
  actors: string[];
}
export interface IPatchMovie {
  id: string;
  description: string;
  cost: number;
  image: string;
}
export interface IMovieReview {
  id: string;
  description: string;
  rating: number;
  datePosted: string;
  isApproved: boolean;
  movieId: string;
  userId: string;
  userReviewer?: IMovieReviewer;
  movieReviews?: {
    title: string;
  };
}
export interface IMovieReviewer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
export interface IActor {
  id: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  age: number;
  image: string;
  link?: string;
  moviesCasted?: IMovie[];
}
export interface IPostActor {
  id?: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  age: number;
  image: string;
  link?: string;
}
export interface IPostReviewProps {
  description: string;
  rating: number;
  movieId: string;
}
export interface IPatchReviewProps {
  id: string;
  isApproved: boolean | string;
}
export interface IDispatchResponse {
  error?: {
    message?: string;
  };
  meta: any;
  payload: any;
  type: string;
}
export interface APICustomResponse<T> {
  status: string;
  data?: T | T[] | null;
  message?: string;
}
