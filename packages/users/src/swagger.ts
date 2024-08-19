import { Options } from 'express-jsdoc-swagger';
import path from 'path';

export const options: Options = {
  info: {
    version: '1.0.0',
    title: 'Users',
    license: {
      name: 'MIT'
    }
  },
  filesPattern: './**/*.ts',
  baseDir: path.resolve(__dirname),
  swaggerUIPath: '/swagger'
};
