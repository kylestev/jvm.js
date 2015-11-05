import * as _ from 'lodash';
import { MemberInfo } from './MemberInfo';

class ClassInfo extends MemberInfo {
  constructor(flags, version, name, superName, pool) {
    super(flags, name);
    this._version = version;
    this._fields = [];
    this._interfaces = [];
    this._methods = [];
    this._pool = pool;
    this._superName = superName;
  }

  addInterface(inter) {
    this._interfaces.push(inter);
  }

  addField(field) {
    this._fields.push(field);
  }

  addMethod(method) {
    this._methods.push(method);
  }

  get fields() {
    return this._fields;
  }

  get interfaces() {
    return this._interfaces;
  }

  get major() {
    return this._version.major;
  }

  get methods() {
    return this._methods;
  }

  get minor() {
    return this._version.minor;
  }

  get pool() {
    return this._pool;
  }

  get superName() {
    return this._superName;
  }

  toJson() {
    return JSON.stringify(this.toObject(), null, 2);
  }

  toObject() {
    let obj = super.toObject();
    let props = {
      superName: this.superName,
      major: this.major,
      minor: this.minor,
      interfaces: this.interfaces,
      pool: this._pool.toObject(),
      fields: _.map(this.fields, (field) => field.toObject()),
      methods: _.map(this.methods, (method) => method.toObject()),
    };

    return _.merge(obj, props);
  }
}

export default {
  ClassInfo
};
