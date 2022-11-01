export interface ILoginResponse {
  status: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      isActivated: boolean;
    };
  };
  message: string;
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
