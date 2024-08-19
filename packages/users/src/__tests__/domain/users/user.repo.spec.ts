import { Container } from '@/app/container';
import { IContainer } from '@/types/container.type';
import { IUser } from '@/types/user.type';
import { SYMBOLS } from '@/app/symbols';
import { TestHelper } from '@/test-helpers/dbInstanceHelper';
import { UserRepo } from '@/domain/users/repo/user.repo';

describe('UserRepo', () => {
  let userRepo: UserRepo;
  let container: IContainer;

  beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
  });

  afterAll(() => {
    TestHelper.instance.teardownTestDB();
  });

  beforeEach(() => {
    container = new Container();
    container.bind(SYMBOLS.DB, TestHelper.instance.dbConnect);
    userRepo = new UserRepo(container);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    const user: IUser = {
      firstName: 'John',
      lastName: 'Doe',
      dob: new Date(),
      email: 'john@doe.com',
      acceptTermsOfService: true
    };

    const result = await userRepo.create(user);

    expect(result).toHaveProperty('id');
    expect(result.firstName).toEqual(user.firstName);
  });

  it('should find a user by id', async () => {
    const user: IUser = {
      firstName: 'Jane',
      lastName: 'Doe',
      dob: new Date(),
      email: 'jane@doe.com',
      acceptTermsOfService: true
    };

    const createdUser = await userRepo.create(user);
    const foundUser = await userRepo.findById(createdUser.id);

    expect(foundUser).toBeDefined();
    expect(foundUser?.id).toEqual(createdUser.id);
    expect(foundUser?.email).toEqual(user.email);
  });

  it('should update a user', async () => {
    const user: IUser = {
      firstName: 'Jake',
      lastName: 'Doe',
      dob: new Date(),
      email: 'jake@doe.com',
      acceptTermsOfService: true
    };

    const createdUser = await userRepo.create(user);
    const updatedData = { firstName: 'Jacob' };
    const updatedUser = await userRepo.update(createdUser.id, updatedData);

    expect(updatedUser).toBeDefined();
    expect(updatedUser?.firstName).toEqual(updatedData.firstName);
  });

  it('should delete a user', async () => {
    const user: IUser = {
      firstName: 'Jim',
      lastName: 'Doe',
      dob: new Date(),
      email: 'jim@doe.com',
      acceptTermsOfService: true
    };

    const createdUser = await userRepo.create(user);
    await userRepo.delete(createdUser.id);
    const foundUser = await userRepo.findById(createdUser.id);

    expect(foundUser).toBeNull();
  });
});
