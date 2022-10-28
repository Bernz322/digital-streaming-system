import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {securityId, UserProfile} from '@loopback/security';
import {compare} from 'bcryptjs';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {Credentials} from '../utils';

export class CustomUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const {email, password} = credentials;
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.userRepository.findOne({
      where: {email},
    });

    if (!foundUser) throw new Error(invalidCredentialsError);

    const credentialsFound = await this.userRepository.findCredentials(
      foundUser.id,
    );

    if (!credentialsFound) throw new Error(invalidCredentialsError);

    const passwordMatched = await compare(password, credentialsFound.password);

    if (!passwordMatched) {
      throw new Error(invalidCredentialsError);
    }
    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    let fullName = `${user.firstName} ${user.lastName}`;
    return {
      [securityId]: user.id,
      id: user.id,
      name: fullName,
      role: user.role,
      isActivated: user.isActivated,
    };
  }
}
