# blood
#### JavaScript object life

```
npm install blood --save
```

## API

### Creation

- `blood.child(parent)` create object that inherits `parent` (emulates `Object.create`)
- `blood.create(parent)` alias for `blood.child(parent)`
- `blood.orphan()` emulates `Object.create(null)`
- `blood.twin(object)` [create twin object](http://stackoverflow.com/q/16594717/770127)
- `blood.combine(keys, values)` create object from corresponding keys and values arrays
- `blood.pair(pairs)` create object from pairs
- `blood.invert(object)` create new object by inverting keys and values

### Mutation

- `blood.assign(to, ...from)` emulates ES6 `Object.assign`
- `blood.adopt(...from)` assign to `this`
- `blood.foster(child, parent)` force child to have a new parent (ES6+)

### Reflection

- `blood.has(object, key)` test if `object` *owns* `key`
- `blood.parent(object)` emulates `Object.getPrototypeOf`
- `blood.parents(object)` get array of parents (up the prototype chain)
- `blood.chain(object)` equals `[object].concat(blood.parents(object))`
- `blood.keys(object)` emulates `Object.keys`
- `blood.names(object)` emulates `Object.getOwnPropertyNames`
- `blood.values(object)` get array of own enumerable values
- `blood.methods(object)` get array of own enumerable functions
- `blood.enums(object)` get array of all enumerable values
- `blood.pairs(object)` get array of `[key, value]` pairs

## Developers

```
npm install
npm test
```

## Compatibility
Works in Node.js and modern browsers (ES5+ except where noted otherwise)

## Fund
[Fund opensource development](https://gratipay.com/~ryanve/) <b>=)</b>

## Playground
[Try `blood` in your browser](http://ryanve.github.io/blood/)
