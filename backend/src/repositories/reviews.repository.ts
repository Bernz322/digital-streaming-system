import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Reviews, User} from '../models';
import {UserRepository} from './user.repository';

export class ReviewsRepository extends DefaultCrudRepository<
  Reviews,
  typeof Reviews.prototype.id
> {
  public readonly userReviewer: BelongsToAccessor<
    User,
    typeof Reviews.prototype.id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
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
  }
}
