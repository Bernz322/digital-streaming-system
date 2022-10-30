import {Entity, model, property} from '@loopback/repository';

@model()
export class MovieCast extends Entity {
  @property({
    type: 'string',
    id: true,
    mongodb: {dataType: 'ObjectID'},
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  actorId: string;

  @property({
    type: 'string',
    required: true,
  })
  movieId: string;

  constructor(data?: Partial<MovieCast>) {
    super(data);
  }
}

export interface MovieCastRelations {
  // describe navigational properties here
}

export type MovieCastWithRelations = MovieCast & MovieCastRelations;
