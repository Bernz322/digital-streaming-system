import {Entity, model, property, hasOne} from '@loopback/repository';
import {UserCredential} from './user-credential.model';

@model()
export class User extends Entity {
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
  email: string;

  @property({
    type: 'string',
    default: 'user',
  })
  role: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isActivated: boolean;

  @property({
    type: 'date',
    default: new Date(),
  })
  dateCreated: string;

  @hasOne(() => UserCredential)
  userCredentials: UserCredential;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
