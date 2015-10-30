const _ = require('./lodash');
const cjson = require('cjson');

const PATH_CONFIG_DIR = './config';

const LOADED_CONFIG = cjson.load([
  PATH_CONFIG_DIR + '/overrides.json',
  PATH_CONFIG_DIR + '/defaults.json'
], true);

export function all() {
  return LOADED_CONFIG;
}

export function get(path, _default = null) {
  // This check allows us to use paths that are dynamically constructed.
  if (Array.isArray(path)) {
    path = path.join('.');
  }

  return _.get(LOADED_CONFIG, path, _default);
}
