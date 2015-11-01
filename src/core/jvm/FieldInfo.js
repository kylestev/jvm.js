import { MemberInfo } from './MemberInfo';

class FieldInfo extends MemberInfo {
  constructor(flags, name, descriptor) {
    super(flags, name);
    this._descriptor = descriptor;
  }

  get desc() {
    return this._descriptor;
  }
}

export default {
  FieldInfo
};
