# [blood](https://github.com/ryanve/blood)

[blood](https://github.com/ryanve/blood) is a cross-browser JavaScript object utility module with methods for inheritance and basic tasks like iteration.

```
$ npm install blood
```

## API

Common methods below are generally compatible with those in [underscore](http://underscorejs.org) and [lodash](http://lodash.com). Interchange libs based on app needs. Parameters labelled with `?` are optional. Read [annotations](http://developers.google.com/closure/compiler/docs/js-for-compiler) and other comments in [the source](blood.js). 

### creation

- `blood.create(parent)` // uses [`Object.create`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) if available
- `blood.twin(source, parent?)` // [clone inheritance](http://stackoverflow.com/q/16594717/770127)
- `blood.keys(object)` // uses [`Object.keys`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) if available
- `blood.values(object)` // get array of *owned* values
- `blood.methods(object)` // get array of *owned* functions
- `blood.pluck(object, key)` // get array of plucked values
- `blood.pick(object, *keys)` // get new object *with* `keys`
- `blood.omit(object, *keys)` // get new object *without* `keys`
- `blood.has(object, key)` // test if `object` *owns* `key`

### extension

- `blood.assign(receiver, supplier)` // emulates ES6 `Object.assign`
- `blood.assign(supplier)` // `this` receives
- `blood.adopt(supplier)`  // `this` receives
- `blood.adopt(receiver, supplier, list)` // assign *listed* keys

### iteration

`accum` callbacks receive `(result, value, key, object)`

- `blood.reduce(object, accum, init?, scope?)` // uses array-like iteration
- `blood.inject(object, accum, init?, scope?)` // iterates *owned* properties

`fn` callbacks receive `(value, key, object)`

- `blood.every(object, fn, scope?)` // uses array-like iteration
- `blood.some(object, fn, scope?)` // uses array-like iteration
- `blood.all(object, fn, scope?)` // iterates *owned* properties
- `blood.any(object, fn, scope?)` // iterates *owned* properties
- `blood.map(object, fn, scope?)` // discerns iteration type