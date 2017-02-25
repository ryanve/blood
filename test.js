!function(root, name) {
  var common = typeof module != 'undefined' && !!module.exports
  var aok = common ? require('aok') : root.aok
  var api = common ? require('./') : root[name]
  var OP = Object.prototype
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
    test: 'a' === api.keys({a:1}).pop() && 0 === api.keys(OP).length
  })

  aok({
    id: 'create',
    test: api.every([null, {a:1}], function(parent) {
      var child = api.create(parent)
      return !!child && !api.keys(child).length && api.line(child) === parent
    })
  })

  aok({
    id: 'names-array',
    test: function() {
      var arr = api.names([])
      this.remark = 'length: ' + arr.length
      return arr.length
    }
  })

  aok({
    id: 'names-plain',
    test: function() {
      var arr = api.names({'length':1}), msg = '.length: ' + arr.length
      this.comment('pass', msg)
      this.comment('fail', msg)
      return arr.length
    }
  })

  aok({
    id: 'names-func',
    test: function() {
      var arr = api.names(isFinite), msg = '.length: ' + arr.length
      this.comment('pass', msg)
      this.comment('fail', msg)
      return arr.length
    }
  })

  aok({
    id: 'tree',
    test: function() {
      var r, a = {id:'a'}, b = api.create(a), c = api.create(b)
      b.id = 'b'
      c.id = 'c'
      r = api.tree(c)
      return 4 === r.length && c === r[0] && b === r[1] && a === r[2] && OP === r[3]
    }
  })

  aok({
    id: 'map',
    test: function() {
      var list = [0, 1, 2, 3, 4]
      return '11111' === api.map(list, function(n, i, o) {
        return this === list && o === list && n == i ? 1 : 0
      }, list).join('')
    }
  })

  aok({
    id: 'collect',
    test: function() {
      var list = {a:0, b:1, c:2, d:3, e:4}
      return isFinite(api.collect(list, function(n, k, o) {
        return this === list && o === list && o[k] === n ? 1 : 0
      }, list).join(''))
    }
  })

  aok({
    id: 'pluck',
    test: function() {
      var list = [{a:0, b:1}, {a:2, b:3}, {a:4, b:5}]
      return '135' === api.pluck(list, 'b').join('')
    }
  })

  aok({
    id: 'pick',
    test: function() {
      return api.every([['b', 'a'], ['a'], [['a']]], function(arr) {
        return api.pick.apply(api, arr.unshift(this) && arr).hasOwnProperty('a')
      }, {a:1, b:1, c:1})
    }
  })

  aok({
    id: 'omit',
    test: function() {
      return api.every([['b', 'a'], ['a'], [['a']]], function(arr) {
        return !api.omit.apply(api, arr.unshift(this) && arr).hasOwnProperty('a')
      }, {a:1, b:1, c:1})
    }
  })
}(this, 'blood');
