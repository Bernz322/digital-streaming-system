import {securityId, UserProfile} from '@loopback/security';
import {givenHttpServerConfig} from '@loopback/testlab';
import {BackendApplication} from '..';
import {Actors, Reviews, User} from '../models';
import {UserRepository} from '../repositories';
import {CustomResponse} from '../utils';

export async function givenRunningApplicationWithCustomConfiguration() {
  const app = new BackendApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();

  app.bind('datasources.config.mongodb').to({
    name: 'mongodb',
    connector: 'mongodb',
  });

  await app.start();
  return app;
}

export async function givenUserRepositories(app: BackendApplication) {
  const userRepo = await app.getRepository(UserRepository);
  return {userRepo};
}

export function rootAdminBody(user?: Partial<User>) {
  const passValue = 'iAmAdmin';
  const data = Object.assign(
    {
      firstName: 'admin',
      lastName: 'root',
      email: 'admin@root.com',
      password: passValue,
    },
    user,
  );
  return new User(data);
}

export function rootAdminUserResponse(user?: Partial<User>) {
  const data = Object.assign(
    {
      status: 'success',
      data: {
        firstName: 'admin',
        lastName: 'root',
        email: 'admin@root.com',
        role: 'admin',
        isActivated: true,
      },
      message: 'Root admin created successfully.',
    },
    user,
  );
  return new User(data);
}

export function newUserBody(user?: Partial<User>) {
  const passValue = 'secretKey';
  const data = Object.assign(
    {
      firstName: 'new',
      lastName: 'test',
      email: 'new@gmail.com',
      password: passValue,
    },
    user,
  );
  return new User(data);
}

export function newUserResponse(user?: Partial<User>) {
  const data = Object.assign(
    {
      status: 'success',
      data: {
        id: '636c71ab2945650ee89caf86',
        firstName: 'new',
        lastName: 'test',
        email: 'new@gmail.com',
        role: 'user',
        isActivated: false,
        dateCreated: '2022-11-10T03:34:33.932Z',
      },
      message: 'User registered successfully.',
    },
    user,
  );
  return new User(data);
}

export function newActorBody(actor?: Partial<Actors>) {
  const data = Object.assign(actor as Partial<Actors>);
  return new Actors(data);
}

export function newActorResponse(actor?: Partial<Actors>) {
  const data = Object.assign(actor as Partial<Actors>);
  const expectedResponse = {
    status: 'success',
    data: new Actors(data),
    message: 'Successfully added a new actor.',
  };
  return expectedResponse;
}

export function newReviewBody(review?: Partial<Reviews>) {
  const data = Object.assign(review as Partial<Reviews>);
  return new Reviews(data);
}

export function newReviewResponse() {
  const expectedResponse = {
    status: 'success',
    data: null,
    message: 'Movie review successfully added.',
  };
  return expectedResponse;
}

export function failedRes(message: string): CustomResponse<{}> {
  return {
    status: 'fail',
    data: null,
    message: message || 'Error',
  };
}

export const mockUsers: UserProfile[] = [
  {
    [securityId]: '6365cbc3e303fc6228363b9d',
    id: ' 6365cbc3e303fc6228363b9d',
    name: 'admin root',
    email: 'admin@root.com',
    role: 'admin',
    isActivated: true,
  },
  {
    [securityId]: '6367094d5c935e220c912f54',
    id: ' 6367094d5c935e220c912f54',
    name: 'John Doe',
    email: 'john@doe.com',
    role: 'user',
    isActivated: true,
  },
];

export const mockActor = {
  firstName: 'Joel',
  lastName: 'Edgerton',
  gender: 'male',
  age: 48,
  image: 'https://flxt.tmsimg.com/assets/171833_v9_bd.jpg',
  link: 'https://www.imdb.com/name/nm0249291/',
};

export const mockReview = {
  movieId: '6365ced2e303fc6228363ba3',
  description:
    'Best Non Stop Action. And I mean Action and Not corny dramas. Other film I recommend you to watch is The Raid.',
  rating: 5,
};

export const fetchUserById: CustomResponse<{}> = {
  status: 'success',
  data: {
    dateCreated: '2022-11-05T02:27:26.229Z',
    email: 'admin@root.com',
    firstName: 'admin',
    id: '6365cbc3e303fc6228363b9d',
    isActivated: true,
    lastName: 'root',
    role: 'admin',
  },

  message: 'User data fetched successfully.',
};

export const fetchUsers: CustomResponse<{}> = {
  status: 'success',
  data: [
    {
      dateCreated: '2022-11-05T02:27:26.229Z',
      email: 'admin@root.com',
      firstName: 'admin',
      id: '6365cbc3e303fc6228363b9d',
      isActivated: true,
      lastName: 'root',
      role: 'admin',
    },
    {
      dateCreated: '2022-11-05T23:57:58.575Z',
      email: 'john@doe.com',
      firstName: 'John',
      id: '6367094d5c935e220c912f54',
      isActivated: true,
      lastName: 'Doe',
      role: 'user',
    },
  ],
  message: 'All users data fetched successfully.',
};

export const fetchActors: CustomResponse<{}> = {
  status: 'success',
  data: [
    {
      age: 35,
      firstName: 'Keanu',
      gender: 'male',
      id: '6365cd4ee303fc6228363b9f',
      image:
        'https://images.mubicdn.net/images/cast_member/2899/cache-2935-1581314680/image-w856.jpg?size=240x',
      lastName: 'Reeves',
      link: 'https://mubi.com/cast/keanu-reeves',
      moviesCasted: 0,
    },
    {
      age: 51,
      firstName: 'Bridget',
      gender: 'female',
      id: '6365ce7ee303fc6228363ba0',
      image:
        'https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQBW-QGOzpSgW5wPbL7mya6t_2Kj2wKJTgHsixsj_OQsif1Cf_myVaffqLEXuND2_UaJsRO_4GuAPzwlkQ',
      lastName: 'Moynahan',
      link: '',
      moviesCasted: 0,
    },
  ],
  message: 'Successfully fetched all actors in the database.',
};

export const fetchActorById: CustomResponse<{}> = {
  status: 'success',
  data: {
    age: 35,
    firstName: 'Keanu',
    gender: 'male',
    id: '6365cd4ee303fc6228363b9f',
    image:
      'https://images.mubicdn.net/images/cast_member/2899/cache-2935-1581314680/image-w856.jpg?size=240x',
    lastName: 'Reeves',
    link: 'https://mubi.com/cast/keanu-reeves',
    moviesCasted: [
      {
        cost: 4500000,
        description:
          "With the untimely death of his beloved wife still bitter in his mouth, John Wick, the expert former assassin, receives one final gift from her--a precious keepsake to help John find a new meaning in life now that she is gone. But when the arrogant Russian mob prince, Iosef Tarasov, and his men pay Wick a rather unwelcome visit to rob him of his prized 1969 Mustang and his wife's present, the legendary hitman will be forced to unearth his meticulously concealed identity. Blind with revenge, John will immediately unleash a carefully orchestrated maelstrom of destruction against the sophisticated kingpin, Viggo Tarasov, and his family, who are fully aware of his lethal capacity. Now, only blood can quench the boogeyman's thirst for retribution.",
        id: '6365ced2e303fc6228363ba3',
        image:
          'https://img.yts.mx/assets/images/movies/john_wick_2014/medium-cover.jpg',
        title: 'John Wick',
        yearReleased: 2014,
      },
      {
        cost: 40000000,
        description:
          "Bound by an inescapable blood debt to the Italian crime lord, Santino D'Antonio, and with his precious 1969 Mustang still stolen, John Wick--the taciturn and pitiless assassin who thirsts for seclusion--is forced to visit Italy to honour his promise. But, soon, the Bogeyman will find himself dragged into an impossible task in the heart of Rome's secret criminal society, as every killer in the business dreams of cornering the legendary Wick who now has an enormous price on his head. Drenched in blood and mercilessly hunted down, John Wick can surely forget a peaceful retirement as no one can make it out in one piece.",
        id: '636708775c935e220c912f49',
        image:
          'https://img.yts.mx/assets/images/movies/john_wick_chapter_2_2017/medium-cover.jpg',
        title: 'John Wick: Chapter 2',
        yearReleased: 2017,
      },
    ],
  },
  message: 'Successfully fetched actor data.',
};

export const searchActorByName: CustomResponse<{}> = {
  status: 'success',
  data: [
    {
      age: 35,
      firstName: 'Keanu',
      gender: 'male',
      id: '6365cd4ee303fc6228363b9f',
      image:
        'https://images.mubicdn.net/images/cast_member/2899/cache-2935-1581314680/image-w856.jpg?size=240x',
      lastName: 'Reeves',
      link: 'https://mubi.com/cast/keanu-reeves',
      moviesCasted: 0,
    },
  ],
  message: 'Successfully fetched actor data.',
};

export const fetchMovies: CustomResponse<{}> = {
  status: 'success',
  data: [
    {
      id: '6365ced2e303fc6228363ba3',
      title: 'John Wick',
      description:
        "With the untimely death of his beloved wife still bitter in his mouth, John Wick, the expert former assassin, receives one final gift from her--a precious keepsake to help John find a new meaning in life now that she is gone. But when the arrogant Russian mob prince, Iosef Tarasov, and his men pay Wick a rather unwelcome visit to rob him of his prized 1969 Mustang and his wife's present, the legendary hitman will be forced to unearth his meticulously concealed identity. Blind with revenge, John will immediately unleash a carefully orchestrated maelstrom of destruction against the sophisticated kingpin, Viggo Tarasov, and his family, who are fully aware of his lethal capacity. Now, only blood can quench the boogeyman's thirst for retribution.",
      image:
        'https://img.yts.mx/assets/images/movies/john_wick_2014/medium-cover.jpg',
      cost: 4500000,
      yearReleased: 2014,
      movieReviews: [
        {
          datePosted: '2022-11-05T23:57:58.575Z',
          description:
            'Best Non Stop Action. And I mean Action and Not corny dramas. Other film I recommend you to watch is The Raid.',
          id: '63670b495c935e220c912f62',
          isApproved: true,
          movieId: '6365ced2e303fc6228363ba3',
          rating: 5,
          userId: '6365d163e303fc6228363baa',
        },
      ],
    },
    {
      id: '636708775c935e220c912f49',
      title: 'John Wick: Chapter 2',
      description:
        "Bound by an inescapable blood debt to the Italian crime lord, Santino D'Antonio, and with his precious 1969 Mustang still stolen, John Wick--the taciturn and pitiless assassin who thirsts for seclusion--is forced to visit Italy to honour his promise. But, soon, the Bogeyman will find himself dragged into an impossible task in the heart of Rome's secret criminal society, as every killer in the business dreams of cornering the legendary Wick who now has an enormous price on his head. Drenched in blood and mercilessly hunted down, John Wick can surely forget a peaceful retirement as no one can make it out in one piece.",
      image:
        'https://img.yts.mx/assets/images/movies/john_wick_chapter_2_2017/medium-cover.jpg',
      cost: 40000000,
      yearReleased: 2017,
    },
    {
      id: '636707055c935e220c912f43',
      title: 'Enola Holmes 2',
      description:
        'Now a detective-for-hire, Enola Holmes takes on her first official case to find a missing girl as the sparks of a dangerous conspiracy ignite a mystery that requires the help of friends - and Sherlock himself - to unravel',
      image:
        'https://img.yts.mx/assets/images/movies/enola_holmes_2_2022/medium-cover.jpg',
      cost: 25000000,
      yearReleased: 2022,
    },
  ],
  message: 'Successfully fetched all movies.',
};

export const fetchMovieReviews: CustomResponse<{}> = {
  status: 'success',
  data: [
    {
      id: '63670b495c935e220c912f62',
      description: 'Actor is a beast',
      rating: 5,
      datePosted: '2022-11-05T23:57:58.575Z',
      isApproved: true,
      movieId: '6365ced2e303fc6228363ba3',
      userId: '6365d163e303fc6228363baa',
      userReviewer: {
        id: '6365d163e303fc6228363baa',
        firstName: 'Jane',
        lastName: 'Doe',
      },
    },
    {
      id: '63670c8b5c935e220c912f66',
      description: 'Best',
      rating: 5,
      datePosted: '2022-11-05T23:57:58.575Z',
      isApproved: true,
      movieId: '6365ced2e303fc6228363ba3',
      userId: '6367094d5c935e220c912f54',
      userReviewer: {
        id: '6367094d5c935e220c912f54',
        firstName: 'John',
        lastName: 'Doe',
      },
    },
  ],
  message: 'Reviews fetched successfully.',
};
