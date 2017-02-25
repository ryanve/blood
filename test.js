!function() {
  var api = require('./')
  var aok = require('aok')
  var OP = Object.prototype
  function noop() {}

  aok.prototype.express = aok.info // uses alert in IE8
  aok.prototype.fail = function() {
    throw new Error('FAILED TEST: ' +  this.id)
  }

  /**
   * @this {{pass:*, fail:*}} aok instance
   * @param {string} key either "pass" or "fail"
   * @param {string} msg message to append
   */
  aok.prototype.comment = function(key, msg) {
    if (!(this instanceof aok)) throw new TypeError('@this')
    if (typeof this[key] == 'string') this[key] += ' (' + msg + ')'
  }

  aok({
    id: 'keys',
    test: 'a' === api.keys({a: 1}).pop()
  })

  aok({
    id: 'values',
    test: api.values([4, 7]).join('') === '47'
  })

  aok({
    id: 'combine',
    test: api.combine(['k'], ['v']).k === 'v'
  })

  aok({
    id: 'child-alias',
    test: api.child === api.create
  })

  aok({
    id: 'parent-object',
    test: api.parent({}) === Object.prototype
  })

  aok({
    id: 'parent-function',
    test: api.parent(noop) === Function.prototype
  })

  aok({
    id: 'orphan',
    test: api.parent(api.orphan()) === null
  })

  aok({
    id: 'parents',
    test: api.parents(noop).pop() === Object.prototype
  })

  aok({
    id: 'chain',
    test: api.chain(noop)[0] === noop
  })

  aok({
    id: 'create',
    test: [null, {a: 1}, function() {}].every(function(parent) {
      var child = api.create(parent)
      return !!child && !api.keys(child).length && api.parent(child) === parent
    })
  })

  aok({
    id: 'names-array',
    test: api.names([]).length
  })

  aok({
    id: 'names-stack',
    test: api.names({length: 0}).length
  })

  aok({
    id: 'names-function',
    test: api.names(function() {}).length
  })

  aok({
    id: 'invert',
    test: api.invert({k: 'v'}).v === 'k'
  })

  aok({
    id: 'assign',
    test: function() {
      var to = {a: 1}
      if (to !== api.assign(to)) return false
      api.assign(to, {b: 2, c: 3},  {d: 4}, {b: 5})
      return to.a === 1 && to.b === 5 && to.c === 3 && to.d === 4
    }
  })

  aok({
    id: 'adopt',
    test: function() {
      var to = {a: 1}
      if (to !== api.adopt.call(to)) return false
      api.adopt.call(to, {b: 2, c: 3}, {d: 4}, {b: 5})
      return to.a === 1 && to.b === 5 && to.c === 3 && to.d === 4
    }
  })

  aok({
    id: 'chain',
    test: function() {
      var a = {id: 'a'}
      var b = api.create(a)
      var c = api.create(b)
      b.id = 'b'
      c.id = 'c'
      var r = api.chain(c)
      return 4 === r.length && c === r[0] && b === r[1] && a === r[2] && OP === r[3]
    }
  })

  console.log('All tests passed =)')
}();
