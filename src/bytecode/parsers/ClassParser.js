import { NiceBuffer } from './NiceBuffer';
import { ClassFile } from '../jvm/ClassFile';
import { AccessFlags } from '../jvm/AccessFlags';
import {SIZE_INT, SIZE_SHORT, SIZE_BYTE} from '../parsers/NiceBuffer';

const Structures = require('../../../data/structures.json');

const Errors = require('../../Errors');
const _ = require('../../util/lodash');
// const Attributes = require('../jvm/Attributes');

export default class ClassParser {
  constructor(name, buff) {
    this.name = name;
    this.buff = new NiceBuffer(buff);
  }

  parse() {
    return new Promise((resolve, reject) => {
      let cls = new ClassFile(this.name);

      try {
        this._parseHeaders(cls);
        this._parseInterfaces(cls);
        this._parseFields(cls);
        this._parseMethods(cls);
        this._parseAttributes(cls);
        // console.log(
        //   _.json(cls.dump())
        // );
      } catch (err) {
        console.log(err)
        reject(err);
      }

      resolve(cls);
    }).catch((err) => console.error.bind(console));
  }

  _parseHeaders(cls) {
    let magic = this.buff.int();
    cls.property('magic', magic);

    if (magic != 0xcafebabe) {
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

  _parseInterfaces(cls) {
    let interfaces_count = this.buff.short();
    cls.property('interfaces_count', interfaces_count);
    for (let ifaceIdx = 0; ifaceIdx < interfaces_count - 1; ifaceIdx++) {
      cls.interfaceIndices.push(this.buff.readStruct(
        Structures.class_file.interface
      ));
    }
  }

  _parseFields(cls) {
    let fields_count = this.buff.short();
    cls.property('fields_count', fields_count);
    for (let fieldIdx = 0; fieldIdx < fields_count; fieldIdx++) {
      cls.fields.push(this.buff.readStruct(
        Structures.class_file.field
      ));
    }
  }

  _parseMethods(cls) {
    let methods_count = this.buff.short();
    cls.property('methods_count', methods_count);
    for (let methodIdx = 0; methodIdx < methods_count; methodIdx++) {
      let method = this.buff.readStruct(
        Structures.class_file.method
      );

      method.attribute_info.forEach((attr) => {
        attr.name = cls.string(attr.attribute_name_index);
      });

      cls.methods.push(method);
    }
  }

  _parseAttributes(cls) {
    let attributes_count = this.buff.short();
    cls.property('attributes_count', attributes_count);
    for (let attributeIdx = 0; attributeIdx < attributes_count; attributeIdx++) {
      cls.attributes.push(this.buff.readStruct(
        Structures.class_file.attribute
      ));
    }

    // resolve attrs
    _.each(cls.attributes, (attr) => {
      let attrName = cls.string(attr.attribute_name_index);
    });
  }
}
