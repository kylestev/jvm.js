import * as _ from 'lodash';

_.mixin({
  json: function (obj, indent = 2) {
    return JSON.stringify(obj, null, indent);
  },

  toMap: function (map) {
    let m = {};
    for (let [key, value] of map) {
      m[key] = value;
    }
    return m;
  }
});

export default _;
