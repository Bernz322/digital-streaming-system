import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {ActorsRepository, MovieCastRepository} from '.';
import {MongodbDataSource} from '../datasources';
import {Actors, MovieCast, Movies, MoviesRelations} from '../models';

export class MoviesRepository extends DefaultCrudRepository<
  Movies,
  typeof Movies.prototype.id,
  MoviesRelations
> {
  public readonly movieCasters: HasManyThroughRepositoryFactory<
    Actors,
    typeof Actors.prototype.id,
    MovieCast,
    typeof Movies.prototype.id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('ActorsRepository')
    protected actorsRepositoryGetter: Getter<ActorsRepository>,
    @repository.getter('MovieCastRepository')
    protected movieCastRepositoryGetter: Getter<MovieCastRepository>,
  ) {
    super(Movies, dataSource);
    this.movieCasters = this.createHasManyThroughRepositoryFactoryFor(
      'movieCasters',
      actorsRepositoryGetter,
      movieCastRepositoryGetter,
    );
  }
}
