import * as _ from 'lodash';

import { Jar } from 'jvm';
import { ClassVisitor } from '../src/ClassVisitor';
import { cloneSet, objectFromMap } from '../src/util';

function acceptVisitors(jar) {
  let visitors = _.values(arguments).slice(1);
  _.values(jar).forEach(cls => visitors.forEach(visitor => visitor.accept(cls)));
}

let FieldKey = (cls, field) => [cls.name, field.name, field.desc].join(':');

let DeclaredFieldFinder = (jar) => {
  let declaredFields = new Set;
  let fieldVisitor = new ClassVisitor({ methods: false });

  fieldVisitor.on('visit-field', (cls, field) => declaredFields.add(FieldKey(cls, field)));

  acceptVisitors(jar, fieldVisitor);

  return declaredFields;
}

let UnreferencedFieldFinder = (jar, declared) => {
  let unreferenced = cloneSet(declared);

  let instructionVisitor = new ClassVisitor({ fields: false });

  instructionVisitor.on('visit-method', (cls, method) => {
    method.instructions
      .filter(insn => insn.constructor.name === 'FieldInstruction')
      .map(insn => FieldKey(cls, insn))
      .forEach(key => unreferenced.delete(key));
  });

  acceptVisitors(jar, instructionVisitor);

  return unreferenced;
};

Jar.unpack('/path/to/your.jar')
  .then(jar => objectFromMap(jar))
  .then((jar) => {
    let s = Date.now();
    let declaredFields = DeclaredFieldFinder(jar);
    let unusedFields = UnreferencedFieldFinder(jar, declaredFields);

    let fieldsReferenced = (declaredFields.size - unusedFields.size);
    console.log('%s/%s fields', fieldsReferenced, declaredFields.size);

    for (let key of unusedFields) {
      let [clazz, name, desc] = key.split(':');
      let cls = jar[clazz];
      let field = _.find(cls.fields, { name, desc });
      _.remove(cls.fields, field);
    }

    let postTransformFieldCount = DeclaredFieldFinder(jar).size;
    console.log('removed %s unused fields', (declaredFields.size - postTransformFieldCount));

    console.log('elapsed ' + (Date.now() - s) + 'ms');
  })
  .catch(console.error.bind(console));
