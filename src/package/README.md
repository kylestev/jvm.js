# jvm-visitor

This module extends [`kylestev/jvm.js`](https://github.com/kylestev/jvm.js) by
exposing classes used for traversing the contents of a `ClassInfo` object from
jvm.js (a JavaScript representation of the JVM class file format) by utilizing
the [Visitor Pattern](https://en.wikipedia.org/wiki/Visitor_pattern).

## Examples

### Field Logging Visitor

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

### VerboseClassVisitor

`jvm-visitor` ships with a verbose version of the default `ClassVisitor` which
has the same interface for interacting with it and behaves the same way with
one caveat: it binds event listeners for each type of even that `ClassVisitor`
emits and prints out basic information about the class file when visited.

This can aid debugging efforts without hampering development time as you can
simply swap `new ClassVisitor` references with `new VerboseClassVisitor` in
your code -- even if you're binding your own event listeners on top of those
used by `VerboseClassVisitor`.

```js
import { Jar } from 'jvm';
import { VerboseClassVisitor } from 'jvm-visitor';

let visitor = new VerboseClassVisitor;

Jar.unpack('/path/to/your.jar')
  .then((jar) => {
    for (let [name, cls] of jar) {
      visitor.accept(cls);
      // output will look similar to the following:
      // >>> [visit-start] ClassName
      // >>> [visit-field] FieldDesc ClassName.FieldName
      // >>> [visit-field] ...
      // >>> [visit-method] ClassName#MethodName+MethodDesc
      // >>> [visit-method] ...
      // >>> [visit-end] ClassName completed in 0.004365655s
      // >>> [visit-start] ClassName1
      // >>> ...
      // >>> [visit-end] ClassName1 completed in 0.004233272s
    }
  })
  .catch(console.error.bind(console));

```
