import * as _ from 'lodash';
const promisify = require('promisify-node');
const fs = promisify('fs');
const Jar = require('./Jar');
const ClassParser = require('./parsers').ClassParser;

_.mixin({
  toMap: function (map) {
    let m = {};
    for (var k of map) {
      let [key, value] = k;
      m[key] = value;
    }
    return m;
  }
});

export default class ClassLoader {
  constructor() {
    this._classes = new Set();
  }

  loadClass(name, buff) {
    return new Promise((resolve, reject) => {
      try {
        let parser = new ClassParser(name, buff);
        return parser.parse()
          .then((cls) => {
            this._classes.set(name, cls);
            return cls;
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  loadClasses(archive) {
    return Promise.all(
      _.map(_.toMap(archive.classBuffers), (buffer, name) => {
        return this.loadClass(name, buffer);
      })
    );
  }

  get classes() {
    return this._classes;
  }

  getClass(clazz) {
    return this._classes.get(clazz);
  }

  loadJar(file) {
    return (new Jar(file)).unpack();
  }
}
