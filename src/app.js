import * as _ from 'lodash';
import * as Loader from './util/Loader';
import InheritanceTree from './util/Inheritance';

const Config = require('../config');
const Inheritance = require('./util/Inheritance');
const Identifier = require('./identifiers/Identifier');

Loader.loadPatterns(Config.patterns)
  .then((patternList) => {
    _.map(patternList, (obj, name) => {
      if (name !== 'Client') return;
      let ident = Identifier.parse(name, obj);
      console.log(JSON.stringify(ident.patterns(), null, 2));
    });
  }).catch(console.error.bind(console));
