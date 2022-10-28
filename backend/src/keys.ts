import {BindingKey} from '@loopback/context';
import {User} from './models';
import {Credentials} from './repositories';
import {UserService} from '@loopback/authentication';

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.user.service',
  );
}
