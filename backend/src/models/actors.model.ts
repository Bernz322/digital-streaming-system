import {Entity, model, property, hasMany} from '@loopback/repository';
import {MovieCast} from './movie-cast.model';
import {Movies} from './movies.model';

@model()
export class Actors extends Entity {
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
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  gender: string;

  @property({
    type: 'number',
    required: true,
  })
  age: number;

  @property({
    type: 'string',
    required: true,
  })
  image: string;

  @property({
    type: 'string',
  })
  link: string;

  @hasMany(() => Movies, {
    through: {model: () => MovieCast, keyFrom: 'actorId', keyTo: 'movieId'},
  })
  moviesCasted: Movies[];

  constructor(data?: Partial<Actors>) {
    super(data);
  }
}

export type ActorsWithRelations = Actors;
