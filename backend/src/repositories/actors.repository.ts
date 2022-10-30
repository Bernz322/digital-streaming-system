import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyThroughRepositoryFactory,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Actors, ActorsRelations, MovieCast, Movies} from '../models';
import {MoviesRepository} from './movies.repository';
import {MovieCastRepository} from './movie-cast.repository';

export class ActorsRepository extends DefaultCrudRepository<
  Actors,
  typeof Actors.prototype.id,
  ActorsRelations
> {
  public readonly moviesCasted: HasManyThroughRepositoryFactory<
    Movies,
    typeof Movies.prototype.id,
    MovieCast,
    typeof Actors.prototype.id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('MoviesRepository')
    protected moviesRepositoryGetter: Getter<MoviesRepository>,
    @repository.getter('MovieCastRepository')
    protected movieCastRepositoryGetter: Getter<MovieCastRepository>,
  ) {
    super(Actors, dataSource);
    this.moviesCasted = this.createHasManyThroughRepositoryFactoryFor(
      'moviesCasted',
      moviesRepositoryGetter,
      movieCastRepositoryGetter,
    );
  }
}
