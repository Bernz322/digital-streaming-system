export type CustomResponse<T> = {
  status: 'success' | 'fail';
  data?: T | T[] | null;
  message?: string;
};

export type Credentials = {
  email: string;
  password: string;
};

export type PostMovieRequest = {
  title: string;
  description: string;
  cost: number;
  image: string;
  yearReleased: number;
  actors: string[];
};
