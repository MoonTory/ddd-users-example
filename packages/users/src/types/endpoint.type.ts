import { Request as ExpressRequest, NextFunction, Response } from 'express';

export type Middleware = (...args: any) => (req: any, res: any, next: any) => any;

export interface Request extends ExpressRequest {}

export abstract class EndpointFunction {
  protected req: Request;
  protected res: Response;
  protected next: NextFunction;
  public readonly middlewares: Middleware[];

  constructor(middlewares: Middleware[]) {
    this.middlewares = middlewares;
  }

  protected abstract executeImpl(): Promise<void | any>;

  public execute = () => async (req: Request, res: Response, next: NextFunction) => {
    this.req = req;
    this.res = res;
    this.next = next;

    try {
      await this.executeImpl();
    } catch (error) {
      this.next(error);
    }
  };

  protected jsonResponse(code: number, payload: any, propName: 'data' | 'error' = 'data') {
    return this.res.status(code).json({ [propName]: payload });
  }

  protected ok(dto?: any) {
    if (!!dto) {
      return this.jsonResponse(200, dto);
    } else {
      return this.res.sendStatus(200);
    }
  }

  protected created(payload?: any) {
    return this.jsonResponse(201, payload ? payload : 'Created');
  }

  protected clientError(payload?: any) {
    return this.jsonResponse(400, payload ? payload : 'Unauthorized', 'error');
  }

  protected unauthorized(payload?: any) {
    return this.jsonResponse(401, payload ? payload : 'Unauthorized', 'error');
  }

  protected paymentRequired(payload?: any) {
    return this.jsonResponse(402, payload ? payload : 'Payment required', 'error');
  }

  protected forbidden(payload?: any) {
    return this.jsonResponse(403, payload ? payload : 'Forbidden', 'error');
  }

  protected notFound(payload?: any) {
    return this.jsonResponse(404, payload ? payload : 'Not found', 'error');
  }

  protected conflict(payload?: any) {
    return this.jsonResponse(409, payload ? payload : 'Conflict', 'error');
  }

  protected unprocessable(payload?: any) {
    return this.jsonResponse(422, payload ? payload : 'Unprocessable Entity', 'error');
  }

  protected tooMany(payload?: any) {
    return this.jsonResponse(429, payload ? payload : 'Too many requests', 'error');
  }

  protected fail(error: Error | string) {
    if (typeof error === typeof Error) return this.jsonResponse(500, error);

    return this.res.status(500).json({ error: error });
  }
}
