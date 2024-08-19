import { AppDataSource } from './data-source';
import { Container } from './container';
import { DataSource } from 'typeorm';
import { ExpressServer } from '@/server';
import { SYMBOLS } from './symbols';
import { UserRepo } from '@/domain/users/repo/user.repo';
import express from 'express';

export abstract class IApplication {
  protected _server: ExpressServer;

  constructor() {}

  abstract start(): Promise<void | any>;
}

export class MicroApp extends IApplication {
  protected readonly _server: ExpressServer;
  protected readonly _container: Container;

  constructor() {
    super();
    this._container = new Container();

    this._container.bind(SYMBOLS.DB, AppDataSource);
    this._container.bind(SYMBOLS.UserRepo, (resolver) => new UserRepo(resolver));

    this._server = new ExpressServer(this._container);
  }

  public get express(): express.Application {
    return this._server.express;
  }

  public async start(): Promise<void> {
    this._container.resolve<DataSource>(SYMBOLS.DB).initialize();
    this._server.start();
  }
}
