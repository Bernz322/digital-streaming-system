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
import {UserRepository as MyUserRepo} from '../repositories';
import {
  CredentialsSchema,
  CustomResponse,
  validateEmail,
  validateName,
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

    @repository(MyUserRepo)
    public myUserRepo: MyUserRepo,
  ) {}

  @post('/users/register')
  @response(200, {
    description:
      'Register a new user. The first user will be given the admin role and is activated immediately.',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
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
      // Validate email and name
      validateEmail(user.email);
      validateName(user.firstName, 'firstName');
      validateName(user.lastName, 'lastName');

      const emailExists = await this.userRepository.findOne({
        where: {email: user.email},
      });

      if (emailExists) {
        return {
          success: false,
          fail: true,
          data: null,
          message: 'Email already exists',
        };
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
      } else {
        const newUser = await this.userRepository.create(
          _.omit(user, ['password']),
        );
        await this.userRepository
          .userCredentials(newUser.id)
          .create({password});
      }

      return {
        success: true,
        fail: false,
        data: null,
        message: 'Registered successfully',
      };
    } catch (error) {
      return {
        success: false,
        fail: true,
        data: null,
        message: error ? error.message : 'Registration failed.',
      };
    }
  }

  @post('/users/login')
  async login(
    @requestBody({
      description: 'Login user and return token with user data',
      content: {
        'application/json': {schema: CredentialsSchema},
      },
    })
    credentials: Credentials,
  ): Promise<CustomResponse<{}>> {
    const {email} = credentials;

    validateEmail(email);

    try {
      const user = await this.userService.verifyCredentials(credentials);
      const userProfile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(userProfile);

      return {
        success: true,
        fail: false,
        data: {
          token,
          user: userProfile,
        },
        message: 'Logged in successfully',
      };
    } catch (error) {
      return {
        success: false,
        fail: true,
        data: null,
        message: error ? error.message : 'Logging in failed.',
      };
    }
  }

  @authenticate('jwt')
  @get('/users/me')
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentLoggedUser: UserProfile,
  ): Promise<any> {
    try {
      const user = await this.userRepository.findById(
        currentLoggedUser[securityId],
      );
      if (!user) throw new Error('Unknown user.');
      return {
        success: true,
        fail: false,
        data: user,
        message: 'Current logged in user data fetched successfully.',
      };
    } catch (error) {
      return {
        success: false,
        fail: true,
        data: null,
        message: error ? error.message : 'Logging in failed.',
      };
    }
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @get('/users')
  @response(200, {
    description:
      'Return array of all users in the database with their information. (Requires token and admin role authorization)',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<CustomResponse<{}>> {
    try {
      const users = await this.myUserRepo.find(filter);

      return {
        success: true,
        fail: false,
        data: users,
        message: 'All users fetched successfully.',
      };
    } catch (error) {
      return {
        success: false,
        fail: true,
        data: null,
        message: error ? error.message : 'Fetching users failed.',
      };
    }
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @get('/users/{id}')
  @response(200, {
    description:
      'Return all data of a user (provide user id). (Requires token and admin role authorization)',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<CustomResponse<{}>> {
    try {
      const user = await this.myUserRepo.findById(id, filter);

      if (!user) throw new Error('User with the given ID not found.');

      return {
        success: true,
        fail: false,
        data: user,
        message: 'User data fetched successfully.',
      };
    } catch (error) {
      return {
        success: false,
        fail: true,
        data: null,
        message: error ? error.message : 'Fetching user data failed.',
      };
    }
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @patch('/users/{id}')
  @response(204, {
    description:
      'Update user (provide user id). (Requires token and admin role authorization)',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
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
      // Validate email and name
      if (user.firstName) validateName(user.firstName, 'firstName');
      if (user.lastName) validateName(user.lastName, 'lastName');
      if (user.email) {
        validateEmail(user.email);
        const emailExists = await this.myUserRepo.findOne({
          where: {email: user.email},
        });

        if (emailExists && emailExists.id !== id)
          throw new Error('Email already exists');
      }

      await this.myUserRepo.updateById(id, user);

      return {
        success: true,
        fail: false,
        data: null,
        message: 'User updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        fail: true,
        data: null,
        message: error ? error.message : 'Updating user failed.',
      };
    }
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @del('/users/{id}')
  @response(204, {
    description:
      'Delete user with their credentials (provide user id). (Requires token and admin role authorization)',
  })
  async deleteById(
    @param.path.string('id') id: string,
  ): Promise<CustomResponse<{}>> {
    try {
      const rootAdmin = await this.myUserRepo.find({
        order: ['dateCreated DESC'],
        limit: 1,
      });
      if (rootAdmin[0].id === id)
        throw new Error('You cannot delete the root admin.');

      await this.userRepository.deleteById(id);
      await this.userRepository.userCredentials(id).delete();
      return {
        success: true,
        fail: false,
        data: null,
        message: 'User data deleted successfully.',
      };
    } catch (error) {
      return {
        success: false,
        fail: true,
        data: null,
        message: error ? error.message : 'Deleting user failed.',
      };
    }
  }
}
