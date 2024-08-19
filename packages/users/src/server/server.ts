import express, { Request, Response } from 'express';

import { IContainer } from '@/types/container.type';
import { IController } from '@/types/controller.type';
import { UsersController } from '@/server/controller/user.controller';
import morgan from 'morgan';
import { options } from '@/swagger';

const expressJSDocSwagger = require('express-jsdoc-swagger');

const { PORT = 4323 } = process.env;

export class ExpressServer {
  private readonly _express: express.Application;

  constructor(private _container: IContainer) {
    this._express = express();
    this.configureMiddleware();
    this.initialize([new UsersController(this._container)]);
    this._express.get('/', (_: Request, res: Response) => res.send({ message: 'Ok!' }));
  }

  public get express(): express.Application {
    return this._express;
  }

  private configureMiddleware() {
    this._express.use(morgan('tiny'));
    this._express.use(express.json());
    this._express.use(express.urlencoded({ extended: false }));
  }

  private initialize(controllers: IController[]) {
    controllers.forEach((cntrl: IController) => {
      this._express.use(cntrl.path, cntrl.router);
    });
  }

  async start() {
    expressJSDocSwagger(this._express)(options);
    this._express.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
  }
}
