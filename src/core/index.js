import * as _ from 'lodash';
const promisify = require('promisify-node');
const fs = promisify('fs');
const ClassLoader = require('./Loader');

export function createLoader() {
  return new Promise((resolve, reject) => {
    resolve(new ClassLoader);
  });
}
