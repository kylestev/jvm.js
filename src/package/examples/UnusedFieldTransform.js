import * as _ from 'lodash';

import { Jar } from 'jvm';
import { VisitorPipeline } from '../src/Pipeline';
import { ClassVisitor } from '../src/ClassVisitor';
import { Flags } from 'jvm/lib/core/jvm/AccessFlags';

let isVisibleToChildren = (member) => {
  return Flags.isPublic(member.accessFlags) || Flags.isProtected(member.accessFlags);
}

let parentHasVisibleField = (jar, cls, name, desc) => {
  if ( ! _.has(jar, cls.superName)) {
    return false;
  }

  let field = _.find(jar[cls.superName].fields, { name, desc });
  return !! field && isVisibleToChildren(field);
}

class FieldVisitor extends ClassVisitor {
  constructor(jar) {
    super();
    this.jar = jar;
    this.visited = new Set;
  }

  get count() {
    return this.visited.size;
  }

  recordField(cls, field) {
    this.visited.add([cls.name, field.name, field.desc].join(':'));
  }

  toArray() {
    return [...this.visited];
  }
}

class DeclaredFieldVisitor extends FieldVisitor {
  constructor(jar) {
    super(jar);
    this.on('visit-start', (cls) => {
      let parent = jar[cls.superName];
      while (parent) {
        parent.fields
          .filter(isVisibleToChildren)
          .forEach(field => this.recordField(cls, field));

        parent = jar[parent.superName];
      }
    });
    this.on('visit-field', (cls, field) => {
      this.recordField(cls, field);
    });
  }
}

class ReferencedFieldVisitor extends FieldVisitor {
  constructor(jar) {
    super(jar);
    this.on('visit-method', (cls, method) => {
      method.instructions
        .filter(insn => insn.constructor.name === 'FieldInstruction' && insn.owner in jar)
        .forEach(insn => this.visitFieldInstruction(insn));
    });
  }

  visitFieldInstruction(insn) {
    let cls = this.jar[insn.owner];
    let fieldStruct = { name: insn.name, desc: insn.desc };
    this.recordField(cls, fieldStruct);

    let parent = this.jar[cls.superName];
    while (parent) {
      let field = _.find(parent.fields, fieldStruct);
      if ( ! field || ! isVisibleToChildren(field)) {
        break;
      }

      this.recordField(parent, field);

      parent = this.jar[parent.superName];
    }
  }
}

Jar.unpack('/path/to/your.jar')
  .then(jar => _.object([...jar]))
  .then(jar => {
    let startMillis = Date.now();

    let declaredFields = new DeclaredFieldVisitor(jar);
    let referencedFields = new ReferencedFieldVisitor(jar);

    let classes = _.values(jar);
    let pipeline = [declaredFields, referencedFields];

    classes.forEach(cls => {
      pipeline.forEach(visitor => visitor.accept(cls));
    });

    let diff = _.difference(declaredFields.toArray(), referencedFields.toArray());

    let endMillis = Date.now();

    console.log('Fields declared but not referenced: %s.', diff.length);
    console.log('Fields referenced: %s/%s', referencedFields.count, declaredFields.count);

    console.log('elapsed ' + (endMillis - startMillis) + 'ms');
  })
  .catch(console.error.bind(console));
