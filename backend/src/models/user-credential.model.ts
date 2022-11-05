import {Entity, model, property} from '@loopback/repository';

@model()
export class UserCredential extends Entity {
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
  password: string;

  @property({
    type: 'string',
    mongodb: {dataType: 'ObjectID'},
  })
  userId: string;

  constructor(data?: Partial<UserCredential>) {
    super(data);
  }
}

export type UserCredentialWithRelations = UserCredential;
