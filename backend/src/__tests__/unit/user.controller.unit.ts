import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {UserController} from '../../controllers';
import {
  ReviewsRepository,
  UserRepository as MyUserRepo,
} from '../../repositories';
import {User} from '../../models';
import {fetchUsers, rejectedRqst} from '../helpers';
import {MyUserService, UserRepository} from '@loopback/authentication-jwt';
import {UserProfile} from '@loopback/security';
import {JWTService} from '../../services';

describe('UserController', () => {
  let userRepository: StubbedInstanceWithSinonAccessor<UserRepository>;
  let reviewsRepository: StubbedInstanceWithSinonAccessor<ReviewsRepository>;
  let jwtService: StubbedInstanceWithSinonAccessor<JWTService>;
  let userService: StubbedInstanceWithSinonAccessor<MyUserService>;
  let user: StubbedInstanceWithSinonAccessor<UserProfile>;
  let myUserRepository: StubbedInstanceWithSinonAccessor<MyUserRepo>;

  let controller: UserController;

  before(resetRepositories);

  describe('User Controller find', () => {
    it('should multiple users', async () => {
      const find = myUserRepository.stubs.find;
      find.resolves(fetchUsers.data as User[]);
      expect(await controller.find()).to.eql(fetchUsers);
      sinon.assert.called(find);
    });
    it('should failed response if rejected', async () => {
      const find = myUserRepository.stubs.find;
      find.rejects();
      expect(await controller.find()).to.eql(rejectedRqst);
      sinon.assert.called(find);
    });
  });

  function resetRepositories() {
    userRepository = createStubInstance(UserRepository);
    reviewsRepository = createStubInstance(ReviewsRepository);
    jwtService = createStubInstance(JWTService);
    userService = createStubInstance(MyUserService);
    myUserRepository = createStubInstance(MyUserRepo);

    controller = new UserController(
      jwtService,
      userService,
      user,
      userRepository,
      reviewsRepository,
      myUserRepository,
    );
  }
});
