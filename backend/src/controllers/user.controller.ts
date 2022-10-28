import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  model,
  property,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  RestBindings,
} from '@loopback/rest';
import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  UserRepository,
  UserServiceBindings,
  UserWithRelations,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _, {has} from 'lodash';
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
    description: 'Register a new user',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
            exclude: ['id', 'role', 'isActivated', 'datePosted'],
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
      description: 'Login user and return token and minimum data',
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
  // @authorize({allowedRoles: ['user']})
  @get('/users/me')
  async whoAmI(
    @inject(SecurityBindings.USER) currentLoggedUser: UserProfile,
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

  // TODO: Delete this api endpoint
  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.myUserRepo.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.myUserRepo.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
