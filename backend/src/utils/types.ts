export type Credentials = {
  email: string;
  password: string;
};

export type CustomResponse<T> = {
  status: 'success' | 'fail';
  data?: T | T[] | null;
  message?: string;
};
