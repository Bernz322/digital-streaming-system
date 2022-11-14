import {
  Filter,
  FilterExcludingWhere,
  model,
  property,
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {User} from '../models';
import {ReviewsRepository, UserRepository as MyUserRepo} from '../repositories';
import {
  UserLoginSchema,
  CustomResponse,
  validateEmail,
  isValidName,
  isNotEmpty,
  CustomResponseSchema,
  isNotNull,
} from '../utils';
import {authorize} from '@loopback/authorization';
@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}
export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository)
    protected userRepository: UserRepository,
    @repository(ReviewsRepository)
    public reviewsRepository: ReviewsRepository,

    @repository(MyUserRepo)
    public myUserRepo: MyUserRepo,
  ) {}

  @post('/users/register')
  @response(200, {
    description: 'Returns newly registered user data.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  async create(
    @requestBody({
      description:
        'Fill in all fields. The first user will be given the admin role and is activated immediately.',
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
            exclude: ['id', 'role', 'isActivated', 'dateCreated'],
          }),
        },
      },
    })
    user: Omit<NewUserRequest, 'id'>,
  ): Promise<CustomResponse<{}>> {
    try {
      // Validate input fields
      validateEmail(user.email);
      isValidName(user.firstName, 'firstName');
      isValidName(user.lastName, 'lastName');
      isNotEmpty(user.password, 'password');
      if (user.password.length < 8)
        throw new Error('Password must be of length 8');

      const emailExists = await this.userRepository.findOne({
        where: {email: user.email},
      });

      if (emailExists) {
        throw new Error('Email is already taken.');
      }

      // Create new user
      // ---------------
      // Hash password
      const password = await hash(user.password, await genSalt());

      // Check user count. If 0, then the new user is the root admin.
      const {count} = await this.userRepository.count();

      if (count === 0) {
        user.isActivated = true;
        user.role = 'admin';
        const newUser = await this.userRepository.create(
          _.omit(user, ['password']),
        );
        await this.userRepository
          .userCredentials(newUser.id)
          .create({password});
        return {
          status: 'success',
          data: newUser,
          message: 'Root admin created successfully.',
        };
      }

      const newUser = await this.userRepository.create(
        _.omit(user, ['password']),
      );
      await this.userRepository.userCredentials(newUser.id).create({password});

      return {
        status: 'success',
        data: newUser,
        message: 'User registered successfully.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'User registration failed.',
      };
    }
  }

  @post('/users/login')
  @response(200, {
    description: 'Returns token and data of the logged in user.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  async login(
    @requestBody({
      description: 'Fill in all fields for logging in.',
      content: {
        'application/json': {schema: UserLoginSchema},
      },
    })
    credentials: Credentials,
  ): Promise<CustomResponse<{}>> {
    const {email} = credentials;
    try {
      // Validate input fields
      validateEmail(email);
      isNotEmpty(credentials.password, 'password');

      const user = await this.userService.verifyCredentials(credentials);
      const userProfile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(userProfile);
      if (!userProfile.isActivated)
        throw new Error('Your account is not yet activated by the admin.');

      return {
        status: 'success',
        data: {
          token,
        },
        message: 'User logged in successfully',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'User logging in failed.',
      };
    }
  }

  @get('/users/me')
  @response(200, {
    description:
      'Returns current logged in user data based on the given token.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentLoggedUser: UserProfile,
  ): Promise<CustomResponse<{}>> {
    try {
      const user = await this.userRepository.findById(
        currentLoggedUser[securityId],
      );
      if (!user) throw new Error('Unknown user.');
      return {
        status: 'success',
        data: user,
        message: 'Current logged in user data fetched successfully.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error
          ? error.message
          : 'Fetching current logged in user data failed. Please login properly.',
      };
    }
  }

  @get('/users')
  @response(200, {
    description:
      'Returns an array of all users in the database with their information. (Requires token and admin role authorization)',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<CustomResponse<{}>> {
    try {
      const users = await this.myUserRepo.find(filter);

      return {
        status: 'success',
        data: users,
        message: 'All users data fetched successfully.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Fetching all users data failed.',
      };
    }
  }

  @get('/users/{id}')
  @response(200, {
    description:
      'Returns all data of a user (provide user id). (Requires token and admin role authorization)',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<CustomResponse<{}>> {
    try {
      const user = await this.myUserRepo.findById(id, filter);

      if (!user) throw new Error('User with the given ID not found.');

      return {
        status: 'success',
        data: user,
        message: 'User data fetched successfully.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Fetching user data failed.',
      };
    }
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'Returns updated data of the edited user.',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      description:
        "Update user's first and last name, email, role, and activated status (provide user id). (Requires token)",
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'Update user',
            exclude: ['id', 'dateCreated'],
            partial: true,
          }),
        },
      },
    })
    user: User,
  ): Promise<CustomResponse<{}>> {
    try {
      const rootAdmin = await this.myUserRepo.find({
        order: ['dateCreated ASC'],
        limit: 1,
      });
      if (rootAdmin[0].id === id)
        throw new Error('You cannot edit the root admin.');

      // Validate input fields
      if (Object.prototype.hasOwnProperty.call(user, 'firstName')) {
        isNotNull(user.firstName, 'firstName');
        isValidName(user.firstName, 'firstName');
      }

      if (Object.prototype.hasOwnProperty.call(user, 'lastName')) {
        isNotNull(user.lastName, 'lastName');
        isValidName(user.lastName, 'lastName');
      }

      if (Object.prototype.hasOwnProperty.call(user, 'email')) {
        isNotNull(user.email, 'email');
        validateEmail(user.email);
        const emailExists = await this.myUserRepo.findOne({
          where: {email: user.email},
        });

        if (emailExists && emailExists.id !== id)
          throw new Error('Email is already taken.');
      }

      if (user.role) {
        if (user.role !== 'admin' && user.role !== 'user')
          throw new Error('Role should only be either admin or user');
      }

      await this.myUserRepo.updateById(id, user);
      const updatedUser = await this.myUserRepo.findById(id);

      return {
        status: 'success',
        data: updatedUser,
        message: 'User updated successfully',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Updating user failed.',
      };
    }
  }

  @del('/users/{id}')
  @response(204, {
    description:
      'Returns deleted user id. (Requires token and admin role authorization)',
    content: {'application/json': {schema: CustomResponseSchema}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async deleteById(
    @param.path.string('id') id: string,
  ): Promise<CustomResponse<{}>> {
    try {
      const rootAdmin = await this.myUserRepo.find({
        order: ['dateCreated ASC'],
        limit: 1,
      });
      if (rootAdmin[0].id === id)
        throw new Error('You cannot delete the root admin.');

      await this.userRepository.deleteById(id);
      await this.userRepository.userCredentials(id).delete();
      await this.reviewsRepository.deleteAll({userId: id});
      return {
        status: 'success',
        data: id,
        message: 'User deleted successfully.',
      };
    } catch (error) {
      return {
        status: 'fail',
        data: null,
        message: error ? error.message : 'Deleting user failed.',
      };
    }
  }
}
