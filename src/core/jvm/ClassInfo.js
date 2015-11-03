import { MemberInfo } from './MemberInfo';

class ClassInfo extends MemberInfo {
  constructor(flags, name, superName, pool) {
    super(flags, name);
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

  get methods() {
    return this._methods;
  }

  get pool() {
    this._pool;
  }

  get superName() {
    return this._superName;
  }
}

export default {
  ClassInfo
};
