import {Entity, hasMany, model, property} from '@loopback/repository';
import {Actors, MovieCast} from '.';
import {Reviews} from './reviews.model';

@model()
export class Movies extends Entity {
  @property({
    type: 'string',
    id: true,
    mongodb: {dataType: 'ObjectID'},
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    default:
      'https://www.pacifictrellisfruit.com/wp-content/uploads/2016/04/default-placeholder-300x300.png',
  })
  image: string;

  @property({
    type: 'number',
    required: true,
  })
  cost: number;

  @property({
    type: 'number',
    required: true,
  })
  yearReleased: number;

  @hasMany(() => Actors, {
    through: {model: () => MovieCast, keyFrom: 'movieId', keyTo: 'actorId'},
  })
  movieCasters: Actors[];

  @hasMany(() => Reviews, {keyTo: 'movieId'})
  movieReviews: Reviews[];

  constructor(data?: Partial<Movies>) {
    super(data);
  }
}

export interface MoviesRelations {
  // describe navigational properties here
}

export type MoviesWithRelations = Movies & MoviesRelations;
