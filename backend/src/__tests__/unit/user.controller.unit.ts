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
import {fetchUsers, failedRes, fetchUserById, mockUsers} from '../helpers';
import {MyUserService, UserRepository} from '@loopback/authentication-jwt';
import {UserProfile} from '@loopback/security';
import {JWTService} from '../../services';

describe('User Controller Unit', () => {
  let userRepository: StubbedInstanceWithSinonAccessor<UserRepository>;
  let reviewsRepository: StubbedInstanceWithSinonAccessor<ReviewsRepository>;
  let jwtService: StubbedInstanceWithSinonAccessor<JWTService>;
  let userService: StubbedInstanceWithSinonAccessor<MyUserService>;
  let user: StubbedInstanceWithSinonAccessor<UserProfile>;
  let myUserRepository: StubbedInstanceWithSinonAccessor<MyUserRepo>;

  let controller: UserController;

  before(resetRepositories);

  describe('User Controller whoAmI', () => {
    it('should return failed response if rejected', async () => {
      const findById = myUserRepository.stubs.findById;

      findById.rejects();

      expect(await controller.whoAmI(mockUsers[0])).to.eql(
        failedRes('Unknown user.'),
      );
    });
  });

  describe('User Controller find', () => {
    it('should return multiple users', async () => {
      const find = myUserRepository.stubs.find;
      find.resolves(fetchUsers.data as User[]);
      expect(await controller.find()).to.eql(fetchUsers);
      sinon.assert.called(find);
    });
    it('should return failed response if rejected', async () => {
      const find = myUserRepository.stubs.find;
      find.rejects();
      expect(await controller.find()).to.eql(failedRes('Error'));
      sinon.assert.called(find);
    });
  });

  describe('User Controller findById', () => {
    it('should return User data by ID', async () => {
      const findById = myUserRepository.stubs.findById;
      const userId = '6365cbc3e303fc6228363b9d';
      findById.resolves(fetchUserById.data as User);
      expect(await controller.findById(userId)).to.eql(fetchUserById);
      sinon.assert.called(findById);
    });
    it('should return failed response if rejected', async () => {
      const findById = myUserRepository.stubs.findById;
      const userId = 'invalidId';
      const expectedMessage = 'Fetching user data failed.';
      findById.rejects({message: expectedMessage});
      expect(await controller.findById(userId)).to.eql(
        failedRes(expectedMessage),
      );
      sinon.assert.called(findById);
    });
  });

  describe('User Controller deleteById', () => {
    it('should return failed response if rejected', async () => {
      const deleteById = userRepository.stubs.deleteById;
      const userId = 'invalidId';
      deleteById.rejects();
      expect(await controller.deleteById(userId)).to.eql(failedRes('Error'));
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
