import { ActorProps } from "../components/ActorCard/ActorCard";
import { IActor, IMovie, IUser } from "./types";

export const mockMovies: IMovie[] = [
  {
    id: "6365ced2e303fc6228363ba3",
    title: "John Wick",
    description:
      "With the untimely death of his beloved wife still bitter in his mouth, John Wick, the expert former assassin, receives one final gift from her--a precious keepsake to help John find a new meaning in life now that she is gone. But when the arrogant Russian mob prince, Iosef Tarasov, and his men pay Wick a rather unwelcome visit to rob him of his prized 1969 Mustang and his wife's present, the legendary hitman will be forced to unearth his meticulously concealed identity. Blind with revenge, John will immediately unleash a carefully orchestrated maelstrom of destruction against the sophisticated kingpin, Viggo Tarasov, and his family, who are fully aware of his lethal capacity. Now, only blood can quench the boogeyman's thirst for retribution.",
    image:
      "https://img.yts.mx/assets/images/movies/john_wick_2014/medium-cover.jpg",
    cost: 4500000,
    yearReleased: 2014,
  },
  {
    id: "636708775c935e220c912f49",
    title: "John Wick: Chapter 2",
    description:
      "Bound by an inescapable blood debt to the Italian crime lord, Santino D'Antonio, and with his precious 1969 Mustang still stolen, John Wick--the taciturn and pitiless assassin who thirsts for seclusion--is forced to visit Italy to honour his promise. But, soon, the Bogeyman will find himself dragged into an impossible task in the heart of Rome's secret criminal society, as every killer in the business dreams of cornering the legendary Wick who now has an enormous price on his head. Drenched in blood and mercilessly hunted down, John Wick can surely forget a peaceful retirement as no one can make it out in one piece.",
    image:
      "https://img.yts.mx/assets/images/movies/john_wick_chapter_2_2017/medium-cover.jpg",
    cost: 40000000,
    yearReleased: 2017,
  },
  {
    id: "636708b75c935e220c912f4d",
    title: "John Wick: Chapter 3 - Parabellum",
    description:
      "In this third installment of the adrenaline-fueled action franchise, skilled assassin John Wick (Keanu Reeves) returns with a $14 million price tag on his head and an army of bounty-hunting killers on his trail. After killing a member of the shadowy international assassin's guild, the High Table, John Wick is excommunicado, but the world's most ruthless hit men and women await his every turn.",
    image:
      "https://img.yts.mx/assets/images/movies/john_wick_chapter_3_parabellum_2019/medium-cover.jpg",
    cost: 75000000,
    yearReleased: 2019,
  },
  {
    id: "6367091b5c935e220c912f50",
    title: "Enola Holmes",
    description:
      "England, 1884 - a world on the brink of change. On the morning of her 16th birthday, Enola Holmes (Millie Bobby Brown) wakes to find that her mother (Helena Bonham Carter) has disappeared, leaving behind an odd assortment of gifts but no apparent clue as to where she's gone or why. After a free-spirited childhood, Enola suddenly finds herself under the care of her brothers Sherlock (Henry Cavill) and Mycroft (Sam Claflin), both set on sending her away to a finishing school for 'proper' young ladies.",
    image:
      "https://img.yts.mx/assets/images/movies/enola_holmes_2020/medium-cover.jpg",
    cost: 30000000,
    yearReleased: 2020,
  },
  {
    id: "636707055c935e220c912f43",
    title: "Enola Holmes 2",
    description:
      "Now a detective-for-hire, Enola Holmes takes on her first official case to find a missing girl as the sparks of a dangerous conspiracy ignite a mystery that requires the help of friends - and Sherlock himself - to unravel",
    image:
      "https://img.yts.mx/assets/images/movies/enola_holmes_2_2022/medium-cover.jpg",
    cost: 25000000,
    yearReleased: 2022,
  },
];

export const mockSearchedMovies: IMovie[] = [
  {
    id: "6365ced2e303fc6228363ba3",
    title: "John Wick",
    description:
      "With the untimely death of his beloved wife still bitter in his mouth, John Wick, the expert former assassin, receives one final gift from her--a precious keepsake to help John find a new meaning in life now that she is gone. But when the arrogant Russian mob prince, Iosef Tarasov, and his men pay Wick a rather unwelcome visit to rob him of his prized 1969 Mustang and his wife's present, the legendary hitman will be forced to unearth his meticulously concealed identity. Blind with revenge, John will immediately unleash a carefully orchestrated maelstrom of destruction against the sophisticated kingpin, Viggo Tarasov, and his family, who are fully aware of his lethal capacity. Now, only blood can quench the boogeyman's thirst for retribution.",
    image:
      "https://img.yts.mx/assets/images/movies/john_wick_2014/medium-cover.jpg",
    cost: 4500000,
    yearReleased: 2014,
  },
  {
    id: "636708775c935e220c912f49",
    title: "John Wick: Chapter 2",
    description:
      "Bound by an inescapable blood debt to the Italian crime lord, Santino D'Antonio, and with his precious 1969 Mustang still stolen, John Wick--the taciturn and pitiless assassin who thirsts for seclusion--is forced to visit Italy to honour his promise. But, soon, the Bogeyman will find himself dragged into an impossible task in the heart of Rome's secret criminal society, as every killer in the business dreams of cornering the legendary Wick who now has an enormous price on his head. Drenched in blood and mercilessly hunted down, John Wick can surely forget a peaceful retirement as no one can make it out in one piece.",
    image:
      "https://img.yts.mx/assets/images/movies/john_wick_chapter_2_2017/medium-cover.jpg",
    cost: 40000000,
    yearReleased: 2017,
  },
  {
    id: "636708b75c935e220c912f4d",
    title: "John Wick: Chapter 3 - Parabellum",
    description:
      "In this third installment of the adrenaline-fueled action franchise, skilled assassin John Wick (Keanu Reeves) returns with a $14 million price tag on his head and an army of bounty-hunting killers on his trail. After killing a member of the shadowy international assassin's guild, the High Table, John Wick is excommunicado, but the world's most ruthless hit men and women await his every turn.",
    image:
      "https://img.yts.mx/assets/images/movies/john_wick_chapter_3_parabellum_2019/medium-cover.jpg",
    cost: 75000000,
    yearReleased: 2019,
  },
];

export const mockMovie: IMovie = {
  id: "6365ced2e303fc6228363ba3",
  title: "John Wick",
  description:
    "With the untimely death of his beloved wife still bitter in his mouth, John Wick, the expert former assassin, receives one final gift from her--a precious keepsake to help John find a new meaning in life now that she is gone. But when the arrogant Russian mob prince, Iosef Tarasov, and his men pay Wick a rather unwelcome visit to rob him of his prized 1969 Mustang and his wife's present, the legendary hitman will be forced to unearth his meticulously concealed identity. Blind with revenge, John will immediately unleash a carefully orchestrated maelstrom of destruction against the sophisticated kingpin, Viggo Tarasov, and his family, who are fully aware of his lethal capacity. Now, only blood can quench the boogeyman's thirst for retribution.",
  image:
    "https://img.yts.mx/assets/images/movies/john_wick_2014/medium-cover.jpg",
  cost: 4500000,
  yearReleased: 2014,
  rating: 4.8,
  movieCasters: [
    {
      age: 35,
      firstName: "Keanu",
      gender: "male",
      id: "6365cd4ee303fc6228363b9f",
      image:
        "https://images.mubicdn.net/images/cast_member/2899/cache-2935-1581314680/image-w856.jpg?size=240x",
      lastName: "Reeves",
      link: "https://mubi.com/cast/keanu-reeves",
    },
    {
      age: 51,
      firstName: "Bridget",
      gender: "female",
      id: "6365ce7ee303fc6228363ba0",
      image:
        "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQBW-QGOzpSgW5wPbL7mya6t_2Kj2wKJTgHsixsj_OQsif1Cf_myVaffqLEXuND2_UaJsRO_4GuAPzwlkQ",
      lastName: "Moynahan",
      link: "",
    },
  ],
  movieReviews: [
    {
      datePosted: "2022-11-05T23:57:58.575Z",
      description:
        "Best Non Stop Action. And I mean Action and Not corny dramas. Other film I recommend you to watch is The Raid.",
      id: "63670b495c935e220c912f62",
      isApproved: true,
      movieId: "6365ced2e303fc6228363ba3",
      rating: 5,
      userId: "6365d163e303fc6228363baa",
      userReviewer: {
        email: "jeffrey@yahoo.com",
        firstName: "Jeffrey",
        id: "6365d163e303fc6228363baa",
        lastName: "Bernadas",
      },
    },
  ],
};

export const mockActors: IActor[] = [
  {
    age: 35,
    firstName: "Keanu",
    gender: "male",
    id: "6365cd4ee303fc6228363b9f",
    image:
      "https://images.mubicdn.net/images/cast_member/2899/cache-2935-1581314680/image-w856.jpg?size=240x",
    lastName: "Reeves",
    link: "https://mubi.com/cast/keanu-reeves",
  },
  {
    age: 51,
    firstName: "Bridget",
    gender: "female",
    id: "6365ce7ee303fc6228363ba0",
    image:
      "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQBW-QGOzpSgW5wPbL7mya6t_2Kj2wKJTgHsixsj_OQsif1Cf_myVaffqLEXuND2_UaJsRO_4GuAPzwlkQ",
    lastName: "Moynahan",
    link: "",
  },
  {
    age: 39,
    firstName: "Adrianne",
    gender: "female",
    id: "6365cea6e303fc6228363ba1",
    image:
      "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcTHSEagcukl6isiR4dOWTgBRZ_5SuhPD1a0moqrq4Y-dR81T7aKz6d348he9sPOVIV_k4ea0y5oFgtaC9Y",
    lastName: "Palicki",
    link: "",
  },
];

export const mockSearchedActor: IActor[] = [
  {
    age: 35,
    firstName: "Keanu",
    gender: "male",
    id: "6365cd4ee303fc6228363b9f",
    image:
      "https://images.mubicdn.net/images/cast_member/2899/cache-2935-1581314680/image-w856.jpg?size=240x",
    lastName: "Reeves",
    link: "https://mubi.com/cast/keanu-reeves",
  },
];

export const mockActor: IActor = {
  age: 35,
  firstName: "Keanu",
  gender: "male",
  id: "6365cd4ee303fc6228363b9f",
  image:
    "https://images.mubicdn.net/images/cast_member/2899/cache-2935-1581314680/image-w856.jpg?size=240x",
  lastName: "Reeves",
  link: "https://mubi.com/cast/keanu-reeves",
  moviesCasted: [
    {
      cost: 4500000,
      description:
        "With the untimely death of his beloved wife still bitter in his mouth, John Wick, the expert former assassin, receives one final gift from her--a precious keepsake to help John find a new meaning in life now that she is gone. But when the arrogant Russian mob prince, Iosef Tarasov, and his men pay Wick a rather unwelcome visit to rob him of his prized 1969 Mustang and his wife's present, the legendary hitman will be forced to unearth his meticulously concealed identity. Blind with revenge, John will immediately unleash a carefully orchestrated maelstrom of destruction against the sophisticated kingpin, Viggo Tarasov, and his family, who are fully aware of his lethal capacity. Now, only blood can quench the boogeyman's thirst for retribution.",
      id: "6365ced2e303fc6228363ba3",
      image:
        "https://img.yts.mx/assets/images/movies/john_wick_2014/medium-cover.jpg",
      title: "John Wick",
      yearReleased: 2014,
    },
    {
      cost: 40000000,
      description:
        "Bound by an inescapable blood debt to the Italian crime lord, Santino D'Antonio, and with his precious 1969 Mustang still stolen, John Wick--the taciturn and pitiless assassin who thirsts for seclusion--is forced to visit Italy to honour his promise. But, soon, the Bogeyman will find himself dragged into an impossible task in the heart of Rome's secret criminal society, as every killer in the business dreams of cornering the legendary Wick who now has an enormous price on his head. Drenched in blood and mercilessly hunted down, John Wick can surely forget a peaceful retirement as no one can make it out in one piece.",
      id: "636708775c935e220c912f49",
      image:
        "https://img.yts.mx/assets/images/movies/john_wick_chapter_2_2017/medium-cover.jpg",
      title: "John Wick: Chapter 2",
      yearReleased: 2017,
    },
  ],
};

export const mockActorCard: ActorProps = {
  actor: {
    age: 35,
    firstName: "Keanu",
    gender: "male",
    id: "6365cd4ee303fc6228363b9f",
    image:
      "https://images.mubicdn.net/images/cast_member/2899/cache-2935-1581314680/image-w856.jpg?size=240x",
    lastName: "Reeves",
    link: "https://mubi.com/cast/keanu-reeves",
    moviesCasted: [],
  },
  isActorsPage: true,
};

export const mockUsers: IUser[] = [
  {
    dateCreated: "2022-11-05T02:27:26.229Z",
    email: "admin@root.com",
    firstName: "admin",
    id: "6365cbc3e303fc6228363b9d",
    isActivated: true,
    lastName: "root",
    role: "admin",
  },
  {
    dateCreated: "2022-11-05T23:57:58.575Z",
    email: "john@doe.com",
    firstName: "John",
    id: "6367094d5c935e220c912f54",
    isActivated: true,
    lastName: "Doe",
    role: "user",
  },
];

export const mockLoginResponseData = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNjVjYmMzZTMwM2ZjNjIyODM2M2I5ZCIsIm5hbWUiOiJhZG1pbiByb290Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjY3NzM1ODk1LCJleHAiOjE2Njc3NTc0OTV9.IKLrqHW1Ci61oy50lqde70SJgRiK8RKug3_FB4MRHZY",
  user: {
    id: "6365cbc3e303fc6228363b9d",
    name: "admin root",
    email: "admin@root.com",
    role: "admin",
    isActivated: true,
  },
};

export const mockRegisterResponseData = {
  dateCreated: "2022-11-05T23:57:58.575Z",
  email: "john@doe.com",
  firstName: "John",
  id: "6367094d5c935e220c912f54",
  isActivated: true,
  lastName: "Doe",
  role: "user",
};
