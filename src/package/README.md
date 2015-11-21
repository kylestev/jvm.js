# jvm-visitor

This module extends [`kylestev/jvm.js`](https://github.com/kylestev/jvm.js) by
exposing classes used for traversing the contents of a `ClassInfo` object from
jvm.js (a JavaScript representation of the JVM class file format) by utilizing
the [Visitor Pattern](https://en.wikipedia.org/wiki/Visitor_pattern).

## Example

```js
import { Jar } from 'jvm';
import { ClassVisitor } from 'jvm-visitor';

// instantiate a new ClassVisitor object
let visitor = new ClassVisitor;
// bind an event listener to the `visit-field` event whose callback is passed
// a `ClassInfo` object as well as a `FieldInfo` object.
visitor.on('visit-field', (cls, field) => {
  console.log('  %s %s.%s', field.desc, cls.name, field.name);
});

// parse the jar contents
Jar.unpack('/path/to/your.jar')
  // called when the Promise returned from `Jar#unpack(string)` succeeds
  .then((jar) => {
    // iterate all `ClassInfo` objects (`cls`) in the jar
    for (let [name, cls] of jar) {
      // pass the `ClassInfo` object to `ClassVisitor#accept(ClassInfo)`
      // in order to visit `cls` and its members
      visitor.accept(cls);
    }
  })
  // catch any uncaught errors during this Promise chain and log them to the console
  .catch(console.error.bind(console));

```
