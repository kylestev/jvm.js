const Config = require('../../config');

const promisify = require('promisify-node');
const fs = promisify('fs');


export function loadJson(path) {
  return fs.readFile(path, 'ASCII')
    .then((contents) => {
      return JSON.parse(contents);
    });
}

export function listRevisions() {
  // return fs.
}

export function loadDump(rev) {
  return loadJson(Config.directories.revisions + rev + '.json');
}

export function loadPatterns() {
  return loadJson(Config.directories.project + 'patterns.json');
}
