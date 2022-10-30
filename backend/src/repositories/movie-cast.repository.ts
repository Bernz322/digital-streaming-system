import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {MovieCast, MovieCastRelations} from '../models';

export class MovieCastRepository extends DefaultCrudRepository<
  MovieCast,
  typeof MovieCast.prototype.id,
  MovieCastRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(MovieCast, dataSource);
  }
}
