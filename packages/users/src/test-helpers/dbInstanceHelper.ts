import { DataSource } from 'typeorm';
import { UserModel } from '@/domain/users/model/user.model';

export class TestHelper {
  private static _instance: TestHelper;

  private constructor() {}

  public static get instance(): TestHelper {
    if (!this._instance) this._instance = new TestHelper();

    return this._instance;
  }

  public dbConnect!: DataSource;

  getRepo(entity: string) {
    return this.dbConnect.getRepository(entity);
  }

  async setupTestDB() {
    this.dbConnect = new DataSource({
      name: 'unit-tests',
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'unit-test',
      password: 'unit-test',
      database: 'unit-test',
      entities: [UserModel],
      synchronize: true
    });

    try {
      await this.dbConnect.initialize();
    } catch (error) {
      console.log('error', JSON.stringify(error));
    }
  }

  teardownTestDB() {
    if (this.dbConnect.isInitialized) this.dbConnect.destroy();
  }
}
