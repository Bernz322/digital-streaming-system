import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {UserCredential, UserCredentialRelations} from '../models';

export type Credentials = {
  email: string;
  password: string;
};

export class UserCredentialRepository extends DefaultCrudRepository<
  UserCredential,
  typeof UserCredential.prototype.id,
  UserCredentialRelations
> {
  constructor(@inject('datasources.mongodb') dataSource: MongodbDataSource) {
    super(UserCredential, dataSource);
  }
}
