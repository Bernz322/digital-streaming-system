import {Entity, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<Actors>) {
    super(data);
  }
}

export interface ActorsRelations {
  // describe navigational properties here
}

export type ActorsWithRelations = Actors & ActorsRelations;
