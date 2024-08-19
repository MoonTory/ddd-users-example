import { Router } from 'express';

export abstract class IController {
  protected _path: string;
  public router: Router;

  public get path(): string {
    return this._path;
  }

  constructor(path: string) {
    this._path = '/' + path;
    this.router = Router();
  }
}
