# blood
#### cross-platform JavaScript object utility module with methods for inheritance and iteration

```
npm install blood --save
```

## API

- Interoperables: Methods are generally compatible with those in [underscore](http://underscorejs.org) and [lodash](http://lodash.com). Interchange libs based on needs.
- Parameters labelled with `?` are optional.
- Read [annotations](http://developers.google.com/closure/compiler/docs/js-for-compiler) and comments in [the source](blood.js).

### Creation

- `blood.create(parent)` uses [`Object.create`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) if available
- `blood.twin(source, parent?)` [clone inheritance](http://stackoverflow.com/q/16594717/770127)
- `blood.keys(object)` uses [`Object.keys`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) if available
- `blood.names(object)` uses [`Object.getOwnPropertyNames`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames) if available
- `blood.values(object)` get array of own enumerable values
- `blood.methods(object)` get array of own enumerable functions
- `blood.pluck(object, key)` get array of plucked values
- `blood.object(keys, values)` get new object made from keys and values
- `blood.pick(object, *keys)` get new object *with* `keys`
- `blood.omit(object, *keys)` get new object *without* `keys`
- `blood.has(object, key)` test if `object` *owns* `key`

### Extension

- `blood.assign(receiver, supplier)` emulates ES6 `Object.assign`
- `blood.assign(supplier)` `this` receives
- `blood.adopt(supplier)` `this` receives
- `blood.adopt(receiver, supplier, list)` assign *listed* keys

### Iteration ([deprecated](../../issues/2))

#### `accum` callbacks receive `(result, value, key, object)`

- `blood.reduce(object, accum, init?, scope?)` uses array-like iteration
- `blood.inject(object, accum, init?, scope?)` iterates *own* properties

#### `fn` callbacks receive `(value, key, object)`

- `blood.every(object, fn, scope?)` uses array-like iteration
- `blood.some(object, fn, scope?)` uses array-like iteration
- `blood.map(object, fn, scope?)` uses array-like iteration
- `blood.all(object, fn, scope?)` iterates *own* properties
- `blood.any(object, fn, scope?)` iterates *own* properties
- `blood.collect(object, fn, scope?)` iterates *own* properties

## Developers

```
npm install
npm test
```

## Fund
Fund development with [tips to @ryanve](https://www.gittip.com/ryanve/) <b>=)</b>

## License
MIT
