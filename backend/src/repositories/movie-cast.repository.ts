import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {MovieCast} from '../models';

export class MovieCastRepository extends DefaultCrudRepository<
  MovieCast,
  typeof MovieCast.prototype.id
> {
  constructor(@inject('datasources.mongodb') dataSource: MongodbDataSource) {
    super(MovieCast, dataSource);
  }
}
