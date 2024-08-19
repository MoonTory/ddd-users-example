import { Request, Response } from 'express';

import { CreateUserSchema } from '@/domain/users/model/user.schema';
import { IContainer } from '@/types/container.type';
import { IController } from '@/types/controller.type';
import { SYMBOLS } from '@/app/symbols';
import { UserRepo } from '@/domain/users/repo/user.repo';
import { validate } from '@/server/middleware/validate';

export class UsersController extends IController {
  private readonly _repo: UserRepo;

  constructor(container: IContainer) {
    super('users');
    this._repo = container.resolve<UserRepo>(SYMBOLS.UserRepo);

    this.router.post('/', validate(CreateUserSchema), this.create);
  }

  /**
   * POST /users
   * @param {CreateUserBody} request.body.required - user info
   * @return {User} 201 - user response
   */
  create = async (req: Request, res: Response) => {
    const user = req.body;

    const find = await this._repo.findByEmail(user.email);

    if (find) {
      return res
        .status(400)
        .json({ error: 'Email already in use', details: [{ message: 'This email is already in use' }] });
    }

    const [month, day, year] = user.dob.split('/').map(Number);
    const parsedDate = new Date(year, month - 1, day);
    if (parsedDate > new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18)) {
      return res
        .status(400)
        .json({ error: 'Underage', details: [{ message: 'You must be 18 years of age to register' }] });
    }

    const result = await this._repo.create(user);

    return res.status(201).json(result);
  };
}
