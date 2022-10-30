import {Entity, hasMany, model, property} from '@loopback/repository';
import {Actors, MovieCast} from '.';

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

  constructor(data?: Partial<Movies>) {
    super(data);
  }
}

export interface MoviesRelations {
  // describe navigational properties here
}

export type MoviesWithRelations = Movies & MoviesRelations;
