import * as _ from 'lodash';

class ConstantPool {
  constructor(pool) {
    this.pool = pool;
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

  toObject() {
    return {
      constant_pool_count: this.size,
      entries: this.pool
    };
  }
}

export default {
  ConstantPool
};
