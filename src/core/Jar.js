import * as _ from 'lodash';
import { ClassLoader } from './ClassLoader';
import { ClassCollection } from './ClassCollection';

const promisify = require('promisify-node');
const fs = promisify('fs');
const AdmZip = require('adm-zip');

class Jar {
  constructor(file) {
    this._file = file;
    this._classBuffers = new Map();
    this._classes = ClassCollection.empty();
  }

  get file() {
    return this._file;
  }

  get classBuffers() {
    return this._classBuffers;
  }

  loadBuffers() {
    let archive = new AdmZip(this.file);
    return new Promise((resolve, reject) => {
      Promise.all(
        archive.getEntries()
          .filter((entry) => entry.entryName.endsWith('.class'))
          // Map will replace the value (not the reference, though) of what we are
          // currently iterating over with the value returned from this method
          .map((entry) => {
            let name = entry.entryName.replace('.class', '');
            return new Promise((resolve, reject) => {
              entry.getDataAsync((buffer, error) => {
                this._classBuffers.set(name, buffer);
                resolve();
              });
            });
          })
      ).then(() => resolve(this));
    })
  }

  static unpack(file) {
    let archive = new Jar(file);
    let classLoader = new ClassLoader();
    return new Promise((resolve, reject) => {
      archive.loadBuffers()
        .then(() => {
          classLoader.loadClasses(archive)
            .then((coll) => {
              archive._classes = coll;
              resolve(archive);
            });
        });
    });
  }

  [Symbol.iterator]() {
    return this._classes[Symbol.iterator]();
  }
}

export default {
  Jar
};
