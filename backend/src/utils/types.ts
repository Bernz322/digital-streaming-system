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

export type NewUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  isActivated: boolean;
  datePosted?: string;
};
