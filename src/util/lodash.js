import * as _ from 'lodash';

_.mixin({
  json: function (obj, indent = 2) {
    return JSON.stringify(obj, null, indent);
  }
});

export default _;

