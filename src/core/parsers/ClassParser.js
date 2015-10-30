import { NiceBuffer } from './NiceBuffer';
import { ClassFile } from '../jvm/ClassFile';
import * as Structures from '../jvm/Structures';
import { AccessFlags } from '../jvm/AccessFlags';
import {SIZE_INT, SIZE_SHORT, SIZE_BYTE} from '../parsers/NiceBuffer';

const Errors = require('../../Errors');
const _ = require('../../util/lodash');
// const Attributes = require('../jvm/Attributes');

const JVM_CLASS_FILE_MAGIC_NUMBER = 0xcafebabe;

export default class ClassParser {
  constructor(name, buff) {
    this.name = name;
    this.buff = new NiceBuffer(buff);
  }

  parse() {
    return new Promise((resolve, reject) => {
      let cls = new ClassFile(this.name);

      Structures.load()
        .then(() => {
          try {
            this._parseHeaders(cls);
            this._parseInterfaces(cls);
            this._parseFields(cls);
            this._parseMethods(cls);
            this._parseAttributes(cls);
            console.log(
              _.json(cls.dump())
            );
          } catch (err) {
            console.log(err)
            reject(err);
          }

          resolve(cls);
        });
    }).catch((err) => console.error.bind(console));
  }

  _parseHeaders(cls) {
    let magic = this.buff.int();
    cls.property('magic', magic);

    if (magic != JVM_CLASS_FILE_MAGIC_NUMBER) {
      throw Errors.Parsing.InvalidClassFileFormat;
    }

    cls.property('minor_version', this.buff.short());
    cls.property('major_version', this.buff.short());

    this._parseConstantPool(cls);
      
    cls.property('access_flags', this.buff.short());
    cls.property('this_class', this.buff.short());
    cls.property('super_class', this.buff.short());
  }

  _parseConstantPool(cls) {
    let constantPoolSize = this.buff.short();
    for (let poolIdx = 0; poolIdx < constantPoolSize - 1; poolIdx++) {
      cls.constantPool.readFromBuffer(this.buff);
    }
  }

  _parseStructureArray(cls, prop) {
    let pluralProp = prop + 's';
    let length = this.buff.short();
    cls.property(pluralProp + '_count', length);
    for (let idx = 0; idx < length; idx++) {
      cls[pluralProp].push(this.buff.readStruct(
        Structures.get(['class_file', prop])
      ));
    }
  }

  _parseInterfaces(cls) {
    this._parseStructureArray(cls, 'interface');
  }

  _parseFields(cls) {
    this._parseStructureArray(cls, 'field');
  }

  _parseMethods(cls) {
    this._parseStructureArray(cls, 'method');
  }

  _parseAttributes(cls) {
    this._parseStructureArray(cls, 'attribute');
  }
}
