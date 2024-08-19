import { Container } from '@/app/container';
import { IContainer } from '@/types/container.type';
import { SYMBOLS } from '@/app/symbols';
import { TestHelper } from '@/test-helpers/dbInstanceHelper';
import { UserRepo } from '@/domain/users/repo/user.repo';
import { UsersController } from '@/server/controller/user.controller';
import express from 'express';
import supertest from 'supertest';

describe('UserController', () => {
  let app: express.Application;
  let request: supertest.SuperTest<supertest.Test>;
  let usersController: UsersController;
  let container: IContainer;

  beforeAll(async () => {
    await TestHelper.instance.setupTestDB();

    container = new Container();
    container.bind(SYMBOLS.DB, TestHelper.instance.dbConnect);
    container.bind(SYMBOLS.UserRepo, (resolver: IContainer) => new UserRepo(resolver));

    usersController = new UsersController(container);
    app = express();
    app.use(express.json());
    app.use('/users', usersController.router);

    request = supertest(app);
  });

  afterAll(() => {
    TestHelper.instance.teardownTestDB();
  });

  afterEach(async () => {
    const repo = container.resolve<UserRepo>(SYMBOLS.UserRepo);
    const users = await repo.findAll();
    await Promise.all(users.map((user) => repo.delete(user.id)));
    jest.clearAllMocks();
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        dob: '04/09/1997',
        email: 'john.doe@example.com',
        acceptTermsOfService: true
      };

      const response = await request.post('/users').send(user);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        ...user,
        id: response.body.id
      });
    });

    it('should return an error if firstName is missing', async () => {
      const user = {
        lastName: 'Doe',
        dob: '04/09/1997',
        email: 'john.doe@example.com',
        acceptTermsOfService: true
      };

      const response = await request.post('/users').send(user);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: 'Invalid data',
        details: [
          {
            message: 'firstName is Required'
          }
        ]
      });
    });

    it('should return an error if lastName is missing', async () => {
      const user = {
        firstName: 'John',
        dob: '04/09/1997',
        email: 'john.doe@example.com',
        acceptTermsOfService: true
      };

      const response = await request.post('/users').send(user);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: 'Invalid data',
        details: [
          {
            message: 'lastName is Required'
          }
        ]
      });
    });

    it('should return an error if dob is under 18', async () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        dob: '04/09/2015',
        email: 'john.doe@example.com',
        acceptTermsOfService: true
      };

      const response = await request.post('/users').send(user);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Underage',
        details: [
          {
            message: 'You must be 18 years of age to register'
          }
        ]
      });
    });

    it('should return an error if dob is missing', async () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        acceptTermsOfService: true
      };

      const response = await request.post('/users').send(user);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: 'Invalid data',
        details: [
          {
            message: 'dob is Required'
          }
        ]
      });
    });

    it('should return an error if dob is in invalid', async () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        dob: '1997-09-04',
        acceptTermsOfService: true
      };

      const response = await request.post('/users').send(user);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: 'Invalid data',
        details: [
          {
            message: 'dob is Invalid date format, expected MM/dd/YYYY'
          }
        ]
      });
    });

    it('should return an error if email is missing', async () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        dob: '04/09/1997',
        acceptTermsOfService: true
      };

      const response = await request.post('/users').send(user);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: 'Invalid data',
        details: [
          {
            message: 'email is Required'
          }
        ]
      });
    });

    it('should return an error if email is invalid', async () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        dob: '04/09/1997',
        email: 'john.doe',
        acceptTermsOfService: true
      };

      const response = await request.post('/users').send(user);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: 'Invalid data',
        details: [
          {
            message: 'email is Invalid email address'
          }
        ]
      });
    });

    it('should return an error if email is already in use', async () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        dob: '04/09/1997',
        acceptTermsOfService: true
      };

      await request.post('/users').send(user);
      const response = await request.post('/users').send(user);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Email already in use',
        details: [
          {
            message: 'This email is already in use'
          }
        ]
      });
    });
  });
});
