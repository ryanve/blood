!function(root, name, make) {
  if (typeof module != 'undefined' && module.exports) module.exports = make()
  else root[name] = make()
}(this, 'blood', function() {

  var AP = Array.prototype
  var OP = Object.prototype
  var hasOwn = OP.hasOwnProperty
  var loops = OP.propertyIsEnumerable
  var push = AP.push
  var slice = AP.slice
  var concat = AP.concat
  var indexOf = AP.indexOf || function(needle, i) {
    var l = this.length
    for (i = 0 > (i >>= 0) ? l + i : i; i < l; i++) if (i in this && this[i] === needle) return i
    return -1
  }

  //stackoverflow.com/a/3705407/770127
  //developer.mozilla.org/en-US/docs/ECMAScript_DontEnum_attribute
  var hasEnumBug = !loops.call({'valueOf':1}, 'valueOf') // IE8-
  var dontEnums = [
    'constructor',
    'propertyIsEnumerable',
    'valueOf',
    'toString',
    'toLocaleString',
    'isProtoypeOf',
    'hasOwnProperty'
  ]

  var proto = '__proto__'
  var supportsProto = proto in OP
  var owns = supportsProto ? hasOwn : function(key) {
    return proto === key ? this === OP : hasOwn.call(this, key)
  }

  /**
   * @param {*} o
   * @param {string|number} key
   * @return {boolean}
   */
  var has = function(o, key) {
    return owns.call(o, key)
  }

  var keys = !hasEnumBug && Object.keys || function(o) {
    var k, i = 0, r = [], others = dontEnums
    for (k in o) has(o, k) && (r[i++] = k)
    if (o !== OP) for (i = others.length; i--;) has(o, k = others[i]) && admit(r, k)
    return r
  }

  var names = !hasEnumBug && Object.getOwnPropertyNames || function(o) {
    // getOwnPropertyNames cannot be emulated exactly. Get as close as possible.
    // Include 'length' if owned and non-enumerable, such as for native arrays.
    var names = keys(o)
    has(o, 'length') && !loops.call(o, 'length') && names.push('length')
    return names
  }

  var nativeCreate = (function(oCreate) {
    try {
      // Object.create(null) should inherit NO properties.
      // Object.create(func) should inherit from Function.
      // Return reference if implementation seems proper.
      if (!oCreate(null)['valueOf'] && oCreate.call === oCreate(oCreate).call) return oCreate
    } catch (e) {}
  }(Object.create))

  var create = nativeCreate || (function(emptyProto) {
    /**
     * @link http://github.com/kriskowal/es5-shim/pull/132
     * @link http://github.com/kriskowal/es5-shim/issues/150
     * @link http://github.com/kriskowal/es5-shim/pull/118
     * @param {Object|null}  parent
     * @return {Object}
     */
    return function(parent) {
      /** @constructor */
      function F() {}
      F.prototype = null === parent ? emptyProto : parent
      var instance = new F // inherits F.prototype
      null === parent || (instance[proto] = parent) // hack getPrototypeOf in IE8-
      return instance
    }
  }(combine([proto].concat(dontEnums), [null])))

  var getPro = Object.getPrototypeOf || function(o) {
    return void 0 !== o[proto] ? o[proto] : (o.constructor || Object).prototype
  }

  var setPro = function(o, pro) {
    o[proto] = pro // experimental
    return o
  }

  /**
   * @param {Object} to
   * @param {Object=} from
   * @param {(Array|string|number|boolean)=} list
   */
  function adopt(to, from, list) {
    var i = arguments.length, force = null != (false === list ? list = null : list)
    if (1 === i) from = to, to = this
    list = force && true !== list ? (typeof list != 'object' ? [list] : list) : keys(from)
    i = list.length
    if (0 < i) while (i--) if (force || !has(to, list[i])) to[list[i]] = from[list[i]]
    return to
  }

  /**
   * @param {Object} to
   * @param {Object} from
   */
  function assign(to, from) {
    // Functionally like the ES6 Object.assign expectation, plus single-param syntax
    1 === arguments.length && (from = to, to = this)
    return adopt(to, from, keys(from))
  }

  /**
   * @param {Object} o
   * @param {Object|null} pro
   */
  function line(o, pro) {
    return 2 == arguments.length ? setPro(o, pro) : getPro(o)
  }

  /**
   * @param {Object} source
   * @return {Object}
   */
  function orphan(source) {
    return source ? assign(create(null), source) : create(null)
  }

  /**
   * @param {(Object|null)=} source
   * @param {(Object|null)=} parent
   */
  function twin(source, parent) {
    var n = arguments.length
    source = n ? source : this
    parent = 2 == n ? parent : getPro(source)
    return adopt(create(parent), source, names(source))
  }

  /**
   * @param {Object} o
   * @return {Array}
   */
  function tree(o) {
    var chain = [o]
    while (null != (o = getPro(o))) chain.push(o)
    return chain
  }

  /**
   * @param {Object} o
   * @return {Array}
   */
  function roots(o) {
    return tree(o).slice(1)
  }

  /**
   * @param {Object} o source to read from
   * @param {Function} cb callback
   * @param {boolean=} fold
   * @return {Function}
   */
  function swap(o, cb, fold) {
    return fold ? function(memo, k) {
      return cb.call(this, memo, o[k], k, o)
    } : function(k) {
      return cb.call(this, o[k], k, o)
    }
  }

  /**
   * @param {Function} fn stack iterator
   * @param {boolean=} fold
   * @return {Function}
   */
  function proxy(fn, fold) {
    return function(o) {
      return fn.apply(fn, map(arguments, function(v, i) {
        return 0 === i ? keys(v) : 1 === i ? swap(o, v, fold) : v
      }))
    }
  }

  /**
   * @param {{length:number}} stack
   * @param {Function=} fn
   * @param {*=} scope
   * @return {boolean}
   */
  function some(stack, fn, scope) {
    var l = stack.length, i = 0
    while (i < l) if (fn.call(scope, stack[i], i++, stack)) return true
    return false
  }

  /**
   * @param {{length:number}} stack
   * @param {Function=} fn
   * @param {*=} scope
   * @return {boolean}
   */
  function every(stack, fn, scope) {
    var l = stack.length, i = 0
    while (i < l) if (!fn.call(scope, stack[i], i++, stack)) return false
    return true
  }

  /**
   * @param {{length:number}} stack
   * @param {Function} accum
   * @param {*=} value
   * @param {*=} scope
   */
  function reduce(stack, accum, value, scope) {
    var i = 0, l = stack.length
    value = 3 > arguments.length ? stack[i++] : value
    while (i < l) value = accum.call(scope, value, stack[i], i++, stack)
    return value
  }

  /**
   * @param {{length:number}} stack
   * @param {Function} fn
   * @param {*=} scope
   * @return {Array}
   */
  function map(stack, fn, scope) {
    var r = [], l = stack.length, i = 0
    while (i < l) r[i] = fn.call(scope, stack[i], i++, stack)
    return r
  }

  /**
   * @param {{length:number}} stack
   * @param {string|number} key
   * @return {Array}
   */
  function pluck(stack, key) {
    return map(stack, function(v) {
      return v[key]
    })
  }

  /**
   * @param {{length:number}} stack
   * @param {*=} value
   * @return {{length:number}}
   */
  function admit(stack, value) {
    ~indexOf.call(stack, value) || push.call(stack, value)
    return stack
  }

  /**
   * @param {Object} o
   * @return {Array}
   */
  function values(o) {
    var list = keys(o), i = list.length
    while (i--) list[i] = o[list[i]]
    return list
  }

  /**
   * @param {Object} o
   * @return {Array} of [key, value] arrays
   */
  function pairs(o) {
    var list = keys(o), i = list.length
    while (i--) list[i] = [list[i], o[list[i]]]
    return list
  }

  /**
   * @param {{length:number}} keys or pairs
   * @param {{length:number}=} values
   * @return {Object} made by keys and values
   */
  function combine(keys, values) {
    var o = {}
    return some(keys, values ? function(n, i) {
      o[n] = values[i]
    } : function(pair) {
      o[pair[0]] = pair[1]
    }), o
  }

  /**
   * @param {Object} o
   * @return {Object} flipped
   */
  function invert(o) {
    return combine(values(o), keys(o))
  }

  /**
   * @param {Object} o
   * @param {string|Array} type
   * @return {Array}
   */
  function types(o, type) {
    var names = keys(o), i = names.length
    type = typeof type != 'object' ? [type] : type
    while (i--) ~indexOf.call(type, typeof o[names[i]]) || names.splice(i, 1)
    return names.sort()
  }

  /**
   * @param {Object} o
   * @return {Array}
   */
  function methods(o) {
    return types(o, 'function')
  }

  /**
   * @param {Object} from
   * @return {Object}
   */
  function pick(from) {
    for (var r = {}, list = concat.apply(AP, slice.call(arguments, 1)), l = list.length, i = 0; i < l; i++)
      if (list[i] in from) r[list[i]] = from[list[i]]
    return r
  }

  /**
   * @param {Object} from
   * @return {Object}
   */
  function omit(from) {
    var k, r = {}, list = concat.apply(AP, slice.call(arguments, 1))
    for (k in from) ~indexOf.call(list, k) || (r[k] = from[k])
    return r
  }

  /**
   * @param {*} a
   * @param {*=} b
   * @return {boolean}
   */
  function same(a, b) {
    // Emulate ES6 Object.is - Fixes NaN and discerns -0 from 0
    return a === b ? (0 !== a || 1/a === 1/b) : a !== a && b !== b
  }

  return {
    'adopt': adopt,
    'all': proxy(every),
    'any': proxy(some),
    'assign': assign,
    'create': create,
    'collect': proxy(map),
    'every': every,
    'has': has,
    'inject': proxy(reduce, true),
    'invert': invert,
    'keys': keys,
    'line': line,
    'loops': loops,
    'map': map,
    'methods': methods,
    'object': combine,
    'orphan': orphan,
    'omit': omit,
    'owns': owns,
    'pairs': pairs,
    'pick': pick,
    'pluck': pluck,
    'names': names,
    'reduce': reduce,
    'roots': roots,
    'tree': tree,
    'twin': twin,
    'types': types,
    'same': same,
    'some': some,
    'values': values
  }
});
