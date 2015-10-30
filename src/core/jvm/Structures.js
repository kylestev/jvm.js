import * as _ from 'lodash';
import * as cjson from 'cjson';
import * as JsonRefs from 'json-refs';
import * as Config from '../../util/Config';

const promisify = require('promisify-node');
const fs = promisify('fs');

const DATA_DIR = Config.get('data.path');

class Structures {
  constructor(path) {
    this.path = path;
    this.structures = {};
    this.hasLoaded = false;
  }

  load() {
    return fs.readFile(DATA_DIR + 'structures.json', 'utf8')
      .then((contents) => {
        return cjson.parse(contents);
      })
      .then(JsonRefs.resolveRefs)
      .then((results) => {
        this.structures = results.resolved;
        this.hasLoaded = true;
      });
  }

  get(path) {
    if ( ! this.hasLoaded) {
      throw new Error('Structures#load must be called (and the Promise returned' +
                      ' must be fulfilled) before Structures#get can be called.');
    }

    if (Array.isArray(path)) {
      path = path.join('.');
    }

    return _.get(this.structures, path);
  }
}

let instance = null;

function getInstance() {
  if (instance === null) {
    instance = new Structures(DATA_DIR);
  }

  return instance;
}

export function load() {
  return getInstance().load();
}

export function get(path) {
  return getInstance().get(path);
}
