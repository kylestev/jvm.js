import * as _ from 'lodash';
import { ACC_ABSTRACT, ACC_SYNTHETIC } from './AccessFlags';
import { parseInstructions } from '../parsers/BytecodeInstructions';
let Exceptions = require('../parsers/attributes/Exceptions');

const AttributeDecoderLookup = {
  Code: function (pool, attr) {
    let method = attr._owner;
    if (method.hasNoMethodBody) {
      throw new Error('This method has no method body.');
    }

    return parseInstructions(method);
  },

  Exceptions: function (pool, attr) {
    return Exceptions.parse(pool, attr).exceptions;
  }
};

class AttributeInfo {
  constructor(attr, owner, pool) {
    this._attr = attr;
    this._data = attr.info;
    this._decoded = false;
    this._name = attr.attribute_name;
    this._owner = owner;
    this._pool = pool;
  }

  get decoded() {
    if ( ! this.hasDecoded) {
      if ( ! _.has(AttributeDecoderLookup, this._name)) {
        throw new Error('Attribute could not be decoded as it has no known decoder.');
      }

      this._decoded = AttributeDecoderLookup[this._name](this._pool, this);
    }

    return this._decoded;
  }

  get hasDecoded() {
    return this._decoded !== false;
  }

  get name() {
    return this._name;
  }

  get raw() {
    return this._attr;
  }

  get rawData() {
    return this._data;
  }

  toObject() {
    return {
      name: this.name,
      length: this._attr.attribute_length
    };
  }
}

export default {
  AttributeInfo
};
