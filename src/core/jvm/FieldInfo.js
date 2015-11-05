import * as _ from 'lodash';
import { MemberInfo } from './MemberInfo';

class FieldInfo extends MemberInfo {
  constructor(flags, name, descriptor) {
    super(flags, name);
    this._descriptor = descriptor;
  }

  get desc() {
    return this._descriptor;
  }

  toObject() {
    return _.merge(super.toObject(), {
      desc: this.desc
    });
  }
}

export {
  FieldInfo
};
