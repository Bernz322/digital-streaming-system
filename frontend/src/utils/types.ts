export interface ILoginResponse {
  status: string;
  data: {
    token: string;
    user: IUserLogin;
  };
  message: string;
}
export interface APICustomResponse<T> {
  status: string;
  data?: T | T[] | null;
  message?: string;
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
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActivated: boolean;
  dateCreated: string;
}
export interface IMovie {
  id: string;
  title: string;
  description: string;
  image: string;
  cost: number;
  yearReleased: number;
}
export interface IActor {
  id: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  age: number;
  image: string;
  link: string;
  moviesCasted?: number;
}
export interface IDispatchResponse {
  error?: {
    message?: string;
  };
  meta: any;
  payload: any;
  type: string;
}
