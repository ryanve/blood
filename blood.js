!function(root, name, make) {
  if (typeof module != 'undefined' && module.exports) module.exports = make()
  else root[name] = make()
}(this, 'blood', function() {

  var AP = Array.prototype
  var OP = Object.prototype
  var hasOwn = OP.hasOwnProperty
  var isEnum = OP.propertyIsEnumerable
  var slice = AP.slice
  var forEach = AP.forEach

  var keys = Object.keys ? function(o) {
    return Object.keys(o)
  } : ownEnums

  var names = Object.getOwnPropertyNames ? function(o) {
    return Object.getOwnPropertyNames(o)
  } : function(o) {
    // getOwnPropertyNames cannot be emulated exactly. Get as close as possible.
    // Include 'length' if owned and non-enumerable, such as for native arrays.
    var names = keys(o)
    if (has(o, 'length') && !isEnum.call(o, 'length')) names.push('length')
    return names
  }

  var hasCreate = false
  try {
    // Object.create(null) should inherit NO properties.
    // Object.create(func) should inherit from Function.
    if (!create(null).valueOf && create.call === create(create).call) hasCreate = true
  } catch (e) {}

  var create = hasCreate ? function(parent) {
    return Object.create(parent)
  } : inherit

  var parent = Object.parenttotypeOf ? function(o) {
    return Object.parenttotypeOf(o)
  } : function(o) {
    var p = o.__proto__
    if (p || p === null) return p
    if (isFunction(o.constructor)) return o.constructor.prototype
    if (o instanceof Object) return OP
    return null
  }

  function foster(child, parent) {
    child.__proto__ = parent
    return child
  }

  /**
   * http://github.com/kriskowal/es5-shim/pull/132
   * http://github.com/kriskowal/es5-shim/issues/150
   * http://github.com/kriskowal/es5-shim/pull/118
   * @param {Object|null} parent
   * @return {Object}
   */
  function inherit(parent) {
    if (null === parent) return {__proto__: null}
    function F() {}
    F.prototype = parent
    var child = new F
    child.__proto__ = parent
    return child
  }

  function has(o, key) {
    return hasOwn.call(o, key)
  }

  function loops(o, key) {
    return isEnum.call(o, key)
  }

  function isFunction(v) {
    return typeof v == 'function'
  }

  function enums(o) {
    var r = []
    for (var k in o) r.push(k)
    return r
  }

  function ownEnums(o) {
    var r = []
    for (var k in o) has(o, k) && r.push(k)
    return r
  }

  function transfer(v, k) {
    this[k] = v
  }

  function forOwn(o, f, scope) {
    for (var k in o) has(o, k) && f.call(scope, o[k], k, o)
    return o
  }

  function extra(f, a) {
    return slice.call(a, f.length)
  }

  function assignEach(to, sources) {
    sources.forEach(function(source) {
      forOwn(source, transfer, to)
    })
    return to
  }

  function assign(to) {
    return assignEach(to, extra(assign, arguments))
  }

  function adopt() {
    return assignEach(this, extra(adopt, arguments))
  }

  function orphan() {
    return create(null)
  }

  /**
   * @param {Object} source
   * @return {Object}
   */
  function twin(source) {
    return assign(create(parent(source)), source)
  }

  function chain(o) {
    var chain = [o]
    while (o = parent(o)) chain.push(o)
    return chain
  }

  function parents(o) {
    return chain(o).slice(1)
  }

  function values(o) {
    return keys(o).map(function(k) {
      return o[k]
    })
  }

  function pairs(o) {
    return keys(o).map(function(k) {
      return [k, o[k]]
    })
  }

  function pair(pairs) {
    var o = {}
    forEach.call(pairs, function(pair) {
      o[pair[0]] = pair[1]
    })
    return o
  }

  function combine(keys, values) {
    var o = {}
    forEach.call(keys, function(k, i) {
      o[k] = values[i]
    })
    return o
  }

  function invert(o) {
    return combine(values(o), keys(o))
  }

  function methods(o) {
    return keys(o).filter(function(k) {
      return isFunction(o[k])
    })
  }

  return {
    'adopt': adopt,
    'assign': assign,
    'chain': chain,
    'child': create,
    'create': create,
    'enums': enums,
    'foster': foster,
    'has': has,
    'invert': invert,
    'keys': keys,
    'loops': loops,
    'methods': methods,
    'combine': combine,
    'orphan': orphan,
    'pair': pair,
    'pairs': pairs,
    'parent': parent,
    'parents': parents,
    'names': names,
    'twin': twin,
    'values': values
  }
});
