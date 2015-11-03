import { ACC_SYNTHETIC, ACC_ABSTRACT } from './AccessFlags';
import { MemberInfo } from './MemberInfo';

class MethodInfo extends MemberInfo {
  constructor(flags, name, descriptor) {
    super(flags, name);
    this._descriptor = descriptor;
  }

  get desc() {
    return this._descriptor;
  }

  get hasNoMethodBody() {
    return this.hasFlag(ACC_SYNTHETIC) || this.hasFlag(ACC_ABSTRACT);
  }

  get hasMethodBody() {
    return ! this.hasNoMethodBody;
  }

  get instructions() {
    let code = this.findAttributeByName('Code');
    if (code) {
      return code.decoded;
    }
    return [];
  }
}

export default {
  MethodInfo
};
