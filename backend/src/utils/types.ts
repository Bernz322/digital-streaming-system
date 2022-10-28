export type Credentials = {
  email: string;
  password: string;
};

export type CustomResponse<T> = {
  success: boolean;
  fail: boolean;
  data?: T | T[] | null;
  message?: string;
};
