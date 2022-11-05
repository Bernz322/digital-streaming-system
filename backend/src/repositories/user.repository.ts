import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasOneRepositoryFactory,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {User, UserCredential, Reviews} from '../models';
import {UserCredentialRepository} from './user-credential.repository';
import {ReviewsRepository} from './reviews.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredential,
    typeof User.prototype.id
  >;

  public readonly userReviews: HasManyRepositoryFactory<
    Reviews,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('UserCredentialRepository')
    protected userCredentialRepositoryGetter: Getter<UserCredentialRepository>,
    @repository.getter('ReviewsRepository')
    protected reviewsRepositoryGetter: Getter<ReviewsRepository>,
  ) {
    super(User, dataSource);
    this.userReviews = this.createHasManyRepositoryFactoryFor(
      'userReviews',
      reviewsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userReviews',
      this.userReviews.inclusionResolver,
    );
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userCredentials',
      this.userCredentials.inclusionResolver,
    );
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredential | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (error) {
      if (error.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw error;
    }
  }
}
