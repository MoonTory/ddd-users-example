import { MicroApp } from '@/app';
import supertest from 'supertest';

describe('app', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(() => {
    const app = new MicroApp();
    request = supertest(app.express);
  });

  it('should return a successful response for GET /', (done) => {
    request.get('/').expect(200, done);
  });
});
