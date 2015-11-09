# jvm.js
A bytecode library for Java written in Node.js

[![npm version](https://badge.fury.io/js/jvm.svg)](https://badge.fury.io/js/jvm)
[![](https://runetek.io/jvm.js/badge.svg)](https://runetek.io/jvm.js/)

This module is under active development and has not yet reached even a `v0.1` release.
This module will be following [SemVer](http://semver.org/) once it is ready for use by 3rd parties.

---

# Installation

```bash
$ npm install jvm
```

And you will be able to get started with using jvm.js. Take a look at the next section for some examples
of how to get started.

# Examples

jvm.js makes use of [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
instead of passing callbacks in functions. This allows your code to not fall victim to the node
callback tree of doom. You'll see examples of it in the examples below.

If you're unfamiliar with Promises, or need a refresher, checkout Mozilla's excellent documentation
[here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

## Loading a Jar's classes

This example using ES6.

```es6
var Jar = require('jvm').Jar;

Jar.unpack('./test.jar')
  .then((jar) => {
    for (let [name, cls] of jar) {
      if (cls.name === 'client') {
        console.log('found client class!');
        console.log(JSON.stringify({
          name: cls.name,
          superName: cls.superName,
          methodCount: cls.methods.length,
          fieldCount: cls.fields.length
        }, null, 2));
      }
    }
  })
  .catch(console.error.bind(console));
```
