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
    required: true,
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

export type MoviesWithRelations = Movies;
