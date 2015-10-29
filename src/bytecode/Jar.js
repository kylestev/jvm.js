import * as _ from 'lodash';
const promisify = require('promisify-node');
const fs = promisify('fs');
const AdmZip = require('adm-zip');

export default class Jar {
  constructor(file) {
    this.file = file;
    this.entries = {};
    this._classes = new Map();
  }

  getData(name) {
    return new Promise((resolve, reject) => {
      this.entries[name].getDataAsync((buffer, err) => {
        if (err) {
          return reject(err);
        }
        resolve({ name, buffer });
      });
    });
  }

  unpack() {
    return new Promise((resolve, reject) => {
      let jar = new AdmZip(this.file);
      Promise.all(
        jar.getEntries()
          // map will replace the value (not the reference, though) of what we are
          // currently iterating over with the value returned from this method
          .map((entry) => {
            let name = entry.entryName;
            if (name.endsWith('.class')) {
              name = name.replace('.class', '');
              return new Promise((resolve, reject) => {
                entry.getDataAsync((buffer, error) => {
                  // this._classes[name] = buffer;
                  this._classes.set(name, buffer);
                  resolve();
                });
              })
            }
          })
      )
      .then(() => resolve(this));
    })
  }

  get classBuffers() {
    return this._classes;
  }

  get classFiles() {
    return _.filter(this.entries, (entry) => entry.entryName.endsWith('.class'));
  }

  get(name) {
    return name in this.entries;
  }

  get files() {
    return _.keys(this.entries);
  }

  all() {
    return _.values(this.entries)[0];
  }
}