import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {MoviesRepository} from '.';
import {MongodbDataSource} from '../datasources';
import {Movies, Reviews, User} from '../models';
import {UserRepository} from './user.repository';

export class ReviewsRepository extends DefaultCrudRepository<
  Reviews,
  typeof Reviews.prototype.id
> {
  public readonly userReviewer: BelongsToAccessor<
    User,
    typeof Reviews.prototype.id
  >;
  public readonly movieReviews: BelongsToAccessor<
    Movies,
    typeof Reviews.prototype.id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('MoviesRepository')
    protected movieRepositoryGetter: Getter<MoviesRepository>,
  ) {
    super(Reviews, dataSource);
    this.userReviewer = this.createBelongsToAccessorFor(
      'userReviewer',
      userRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userReviewer',
      this.userReviewer.inclusionResolver,
    );
    this.movieReviews = this.createBelongsToAccessorFor(
      'movieReviews',
      movieRepositoryGetter,
    );
    this.registerInclusionResolver(
      'movieReviews',
      this.movieReviews.inclusionResolver,
    );
  }
}
