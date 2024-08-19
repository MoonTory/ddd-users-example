import { DataSource } from 'typeorm';
import { UserModel } from '@/domain/users/model/user.model';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'app',
  password: 'app',
  database: 'app',
  synchronize: true,
  logging: false,
  entities: [UserModel],
  migrations: [],
  subscribers: []
});
