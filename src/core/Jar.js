import * as _ from 'lodash';
import { ClassLoader } from './ClassLoader';
import { ClassCollection } from './ClassCollection';

const promisify = require('promisify-node');
const fs = promisify('fs');
const AdmZip = require('adm-zip');

/**
 * Wrapper around a Java Archive file.
 *
 * Provides convenience methods for loading a Jar's classes.
 *
 * @see https://en.wikipedia.org/wiki/JAR_(file_format)
 */
class Jar {
  /**
   * You probably want to create a new instance using {@link Jar.unpack}
   * @param  {string} file - path to Jar file
   */
  constructor(file) {
    this._file = file;
    this._classBuffers = new Map();
    this._classes = ClassCollection.empty();
  }

  /**
   * @return {string} path to Jar file
   */
  get file() {
    return this._file;
  }

  /**
   * @return {Map<string, Buffer>}
   */
  get classBuffers() {
    return this._classBuffers;
  }

  /**
   * @private
   * @return {Promise<Jar>}
   */
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

  /**
   * Static constructor for a {@link Jar} that also attempts to load all
   * classes contained in the Jar file.
   *
   * Creates a new {@link ClassLoader} under the hood to load the classes.
   *
   * @example <caption>Loading a Jar file</caption>
   * // ES6 example
   * import { Jar } from 'jvm';
   * Jar.unpack('./test.jar')
   *   .then((jar) => {
   *     for (let [name, cls] of jar) {
   *       if (name === 'ClassNameToFind') {
   *         console.log(name, 'has', cls.methods.length, 'methods!');
   *       }
   *     }
   *   });
   * @param  {string} file - path to Jar file
   * @return {Promise<Jar>}
   */
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

  /**
   * {@link ClassCollection} iterator
   * @return {Iterator}
   */
  [Symbol.iterator]() {
    return this._classes[Symbol.iterator]();
  }
}

export {
  Jar
};
