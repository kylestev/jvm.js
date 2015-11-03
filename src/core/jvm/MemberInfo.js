import * as _ from 'lodash';

class MemberInfo {
  constructor(accessFlags, name) {
    this._attributes = [];
    this._flags = accessFlags;
    this._name = name;
  }

  get accessFlags() {
    return this._flags;
  }

  get attributes() {
    return this._attributes;
  }

  addAttribute(attr) {
    this._attributes.push(attr);
  }

  findAttributeByName(name) {
    return _.first(this.findAttributesByName(name));
  }

  findAttributesByName(name) {
    return this.attributes.filter((attr) => attr.name === name);
  }

  hasFlag(flag) {
    return ((this.accessFlags & flag) !== 0);
  }

  get name() {
    return this._name;
  }
}

export default {
  MemberInfo
};
