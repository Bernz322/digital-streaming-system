import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {ActorsRepository, MovieCastRepository} from '.';
import {MongodbDataSource} from '../datasources';
import {Actors, MovieCast, Movies, MoviesRelations, Reviews} from '../models';
import {ReviewsRepository} from './reviews.repository';

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

  public readonly movieReviews: HasManyRepositoryFactory<
    Reviews,
    typeof Movies.prototype.id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('ActorsRepository')
    protected actorsRepositoryGetter: Getter<ActorsRepository>,
    @repository.getter('MovieCastRepository')
    protected movieCastRepositoryGetter: Getter<MovieCastRepository>,
    @repository.getter('ReviewsRepository')
    protected reviewsRepositoryGetter: Getter<ReviewsRepository>,
  ) {
    super(Movies, dataSource);
    this.movieReviews = this.createHasManyRepositoryFactoryFor(
      'movieReviews',
      reviewsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'movieReviews',
      this.movieReviews.inclusionResolver,
    );
    this.movieCasters = this.createHasManyThroughRepositoryFactoryFor(
      'movieCasters',
      actorsRepositoryGetter,
      movieCastRepositoryGetter,
    );
    this.registerInclusionResolver(
      'movieCasters',
      this.movieCasters.inclusionResolver,
    );
  }
}
