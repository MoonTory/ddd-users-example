import { DataSource, Repository } from 'typeorm';
import { IUser, IUserRepo } from '@/types/user.type';

import { IContainer } from '@/types/container.type';
import { SYMBOLS } from '@/app/symbols';
import { UserModel } from '@/domain/users/model/user.model';

export class UserRepo implements IUserRepo {
  private _repo: Repository<UserModel>;

  constructor(container: IContainer) {
    this._repo = container.resolve<DataSource>(SYMBOLS.DB).getRepository(UserModel);
  }

  public async create(user: IUser): Promise<UserModel> {
    return await this._repo.save(user);
  }

  public async update(id: number, data: Partial<IUser>): Promise<UserModel> {
    await this._repo.update({ id }, data);

    return (await this.findById(id))!;
  }

  public async delete(id: number): Promise<boolean> {
    const user = await this.findById(id);

    if (!user) return false;

    return (await this._repo.remove(user)).id === id;
  }

  public async findAll(): Promise<UserModel[]> {
    return await this._repo.find();
  }

  public async findById(id: number): Promise<UserModel | null> {
    return await this._repo.findOne({ where: { id } });
  }

  public async findByEmail(email: string): Promise<UserModel | null> {
    return await this._repo.findOne({ where: { email } });
  }
}
