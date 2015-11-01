const promisify = require('promisify-node');
const fs = promisify('fs');
const Jar = require('./Jar');
const _ = require('../util/lodash');
import { ClassFileParser } from './parsers/ClassFileParser';
import { ACC_ABSTRACT, ACC_SYNTHETIC } from './jvm/AccessFlags';
import { injectInstructions } from './parsers/BytecodeInstructions';

function replaceConstantPoolStringLookups(memberInfo, pool) {
  let lookups = ['name_index', 'descriptor_index', 'attribute_name_index'];

  _.intersection(lookups, _.keys(memberInfo))
    .forEach((lookup) => {
      let parts = lookup.split('_');
      // This gives us all but the last "part" aka no _index suffix.
      let namePrefix = parts.splice(0, parts.length - 1).join('_');

      let poolIdx = memberInfo[lookup] - 1;
      let poolEntry = _.get(pool, [poolIdx, 'info', 'bytes']);
      // structure looks like: pool[poolIdx] = { tag: 1, info: { len: 10, bytes: 'SourceFile' }}

      memberInfo[namePrefix] = poolEntry;
    });

  // Fields and methods have nested attribute_info key-value-pairs which should have
  // their relevant strings pulled for them.
  _.each(_.intersection(['attribute_info'], _.keys(memberInfo)), (key) => {
    // We don't need to recurse if we're not going to find anything
    if (_.isEmpty(memberInfo[key])) {
      return;
    }

    memberInfo[key] = _.map(memberInfo[key], (nestedMemberInfo) => {
      return replaceConstantPoolStringLookups(nestedMemberInfo, pool);
    });
  });

  return memberInfo;
}

export default class ClassLoader {
  constructor() {
    this._classes = new Map();
  }

  loadClass(name, buff) {
    return new Promise((resolve, reject) => {
      try {
        let cls = ClassFileParser.parse(buff);

        ['interfaces', 'fields', 'methods', 'attributes'].forEach((type) => {
          if (_.has(cls, type)) {
            _.each(cls[type], (info) => {
              replaceConstantPoolStringLookups(info, cls.constant_pool);
            });
          }
        });

        cls.methods = cls.methods.map((method) => {
          if ((method.access_flags & ACC_ABSTRACT) === 0 && (method.access_flags & ACC_SYNTHETIC) === 0) {
            return injectInstructions(method);
          }

          return method;
        });

        resolve(cls);
      } catch (err) {
        reject(err);
      }
    });
  }

  loadClasses(archive) {
    return Promise.all(
      _.map(_.toMap(archive.classBuffers), (buffer, name) => {
        return this.loadClass(name, buffer)
          .then((cls) => {
            this._classes.set(name, cls);
            return cls;
          });
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
