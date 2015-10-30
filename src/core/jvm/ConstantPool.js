import * as _ from 'lodash';
import * as Structure from './Structures';
import {SIZE_INT, SIZE_SHORT, SIZE_BYTE} from '../parsers/NiceBuffer';

const CLASS_POOL_CLASS = 7;
const CLASS_POOL_FIELD_REF = 9;
const CLASS_POOL_METHOD_REF = 10;
const CLASS_POOL_INTERFACE_METHOD_REF = 11;
const CLASS_POOL_STRING = 8;
const CLASS_POOL_INTEGER = 3;
const CLASS_POOL_FLOAT = 4;
const CLASS_POOL_LONG = 5;
const CLASS_POOL_DOUBLE = 6;
const CLASS_POOL_NAME_AND_TYPE = 12;
const CLASS_POOL_UTF8 = 1;
const CLASS_POOL_METHOD_HANDLE = 15;
const CLASS_POOL_METHOD_TYPE = 16;
const CLASS_POOL_INVOKE_DYNAMIC = 18;

let getConstantPoolStructure = _.memoize((index) => {
  return Structure.get(['class_file', 'constant_pool', 'lookup', index]).attrs;
});

export class ConstantPool {
  constructor() {
    this.pool = [];
  }

  at(idx) {
    return this.pool[idx - 1];
  }

  find(criteria) {
    return _.find(this.pool, criteria);
  }

  get size() {
    return _.size(this.pool);
  }

  readFromBuffer(buff) {
    let tag = buff.byte();
    let instance = { tag };
    let struct = getConstantPoolStructure(tag);

    _.each(struct, (lookup) => {
      let [key, len] = lookup;
      if (key.startsWith('$')) {
        key = key.substring(1);
        let length = instance[len];
        instance[key] = buff.slice(length);
      } else {
        instance[key] = buff.read(len);
      }
    });

    return this.pool.push(instance);
  }
}
