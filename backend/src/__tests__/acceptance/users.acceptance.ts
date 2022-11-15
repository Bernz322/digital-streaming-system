import {Client, createRestAppClient, expect} from '@loopback/testlab';
import _ from 'lodash';
import {BackendApplication} from '../..';
import {UserRepository} from '../../repositories';
import {isNotEmpty, isValidName, validateEmail} from '../../utils';
import {
  givenRunningApplicationWithCustomConfiguration,
  givenUserRepositories,
  loginTest,
  registerAdmin,
  registerUser,
  rootAdminBody,
} from '../helpers';

describe('User Controller Acceptance', () => {
  let app: BackendApplication;
  let client: Client;
  let userRepo: UserRepository;
  let token = '';

  before(async () => {
    app = await givenRunningApplicationWithCustomConfiguration();
  });
  after(() => app.stop());

  before(async () => {
    ({userRepo} = await givenUserRepositories(app));
  });
  before(() => {
    client = createRestAppClient(app);
  });

  describe('Validations', () => {
    it('validateEmail() fails with invalid email', () => {
      const expectedError = 'Invalid email format.';
      const email = 'domdomdom';
      expect(() => validateEmail(email)).to.throw(expectedError);
    });

    it('isValidName() fails with empty first name', () => {
      const expectedError = 'Field firstName name is required.';
      const fName = '';
      expect(() => isValidName(fName, 'firstName')).to.throw(expectedError);
    });

    it('isValidName() fails with invalid last name', () => {
      const expectedError = 'Invalid name in field lastName';
      const lName = '123';
      expect(() => isValidName(lName, 'lastName')).to.throw(expectedError);
    });

    it('isNotEmpty() fails with empty password', () => {
      const expectedError = 'Field password is required.';
      const password = '';
      expect(() => isNotEmpty(password, 'password')).to.throw(expectedError);
    });
  });

  context('As admin', () => {
    it('should create root admin as the first registered user', async function () {
      await userRepo.deleteAll();
      const rootAdmin = rootAdminBody();
      const response = await client
        .post('/users/register')
        .send(rootAdmin)
        .expect(200);

      rootAdmin.role = 'admin';
      rootAdmin.isActivated = true;
      const data = _.omit(rootAdmin, 'password');
      const expected = {
        status: 'success',
        data,
        message: 'Root admin created successfully.',
      };

      const res = response.body;

      expect(res.message).to.equal(expected.message);
      expect(res.status).to.equal(expected.status);
      expect(res.data.role).to.equal(expected.data.role);
      expect(res.data.isActivated).to.equal(expected.data.isActivated);
      expect(res.data.email).to.equal(expected.data.email);
    });
    it('should login as root admin', async () => {
      token = await loginTest(client, 'admin');
      expect(token).to.be.not.null();
    });
    it('should return admin data based on given token', async () => {
      const response = await client
        .get(`/users/me`)
        .set({Authorization: `Bearer ${token}`})
        .expect(200);
      const expected = {
        status: 'success',
        data: {
          firstName: 'admin',
          lastName: 'root',
          email: 'admin@root.com',
          role: 'admin',
          isActivated: true,
        },
        message: 'Current logged in user data fetched successfully.',
      };
      expect(response.body.status).to.equal(expected.status);
      expect(response.body.message).to.equal(expected.message);
      expect(response.body.data.isActivated).to.equal(
        expected.data.isActivated,
      );
      expect(response.body.data.role).to.equal(expected.data.role);
      expect(response.body.data.email).to.equal(expected.data.email);
    });
    it('should fetch all users', async () => {
      await registerUser(client, 'user@one.com');

      const response = await client
        .get('/users')
        .set({Authorization: `Bearer ${token}`})
        .expect(200);
      expect(response.body.data.length).to.be.equal(2);
    });
    it('should update and activate a user', async () => {
      const newUser = await registerUser(client, 'user@two.mail.com');
      const userData = {
        firstName: 'edited name',
        isActivated: true,
      };
      const response = await client
        .patch(`/users/${newUser.data.id}`)
        .set({Authorization: `Bearer ${token}`})
        .send(userData)
        .expect(200);
      const expected = {
        status: 'success',
        message: 'User updated successfully',
      };
      expect(response.body.status).to.equal(expected.status);
      expect(response.body.message).to.equal(expected.message);

      const updatedUser = await userRepo.findById(newUser.data.id);
      expect(updatedUser.isActivated).to.be.true();
      expect(updatedUser.firstName).to.be.equal(userData.firstName);
    });
    it('should delete a user', async () => {
      const newUser = await registerUser(client, 'user@three.mail.com');
      const response = await client
        .delete(`/users/${newUser.data.id}`)
        .set({Authorization: `Bearer ${token}`})
        .expect(200);
      const expected = {
        status: 'success',
        message: 'User deleted successfully.',
      };
      expect(response.body.data).to.equal(newUser.data.id);
      expect(response.body.status).to.equal(expected.status);
      expect(response.body.message).to.equal(expected.message);

      const deletedUser = await userRepo.find({where: {id: newUser.data.id}});
      expect(deletedUser).to.be.empty();
    });
  });

  context('As user', () => {
    before(async () => {
      await userRepo.deleteAll();
      await registerAdmin(client);
    });
    it('should register but is not activated', async () => {
      const newUser = await registerUser(client, 'user@one.mail.com');
      expect(newUser.data.isActivated).to.be.false();
    });
    it('should not be able to register if email is taken', async () => {
      const newUser = await registerUser(client, 'user@one.mail.com');
      const expected = {
        status: 'fail',
        message: 'Email is already taken.',
      };
      expect(newUser.status).to.equal(expected.status);
      expect(newUser.message).to.equal(expected.message);
    });
    it('should not be able to access admin only routes', async () => {
      const sampleId = 'thisIsASampleId';
      await client.get(`/users`).expect(401);
      await client.get(`/users/${sampleId}`).expect(401);
      await client.patch(`/users/${sampleId}`).expect(401);
      await client.delete(`/users/${sampleId}`).expect(401);
    });
  });
});
