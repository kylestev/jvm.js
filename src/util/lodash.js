import * as _ from 'lodash';

_.mixin({
  json: function (obj, indent = 2) {
    return JSON.stringify(obj, null, indent);
  },

  toMap: function (map) {
    let m = {};
    for (var k of map) {
      let [key, value] = k;
      m[key] = value;
    }
    return m;
  }
});

export default _;
