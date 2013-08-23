/*!
 * blood        inheritance module
 * @link        github.com/ryanve/blood
 * @license     MIT
 * @copyright   2013 Ryan Van Etten
 * @version     0.5.3
 */

/*jshint expr:true, sub:true, supernew:true, debug:true, node:true, boss:true, devel:true, evil:true, 
  laxcomma:true, eqnull:true, undef:true, unused:true, browser:true, jquery:true, maxerr:100 */

(function(root, name, make) {
    typeof module != 'undefined' && module['exports'] ? module['exports'] = make() : root[name] = make();
}(this, 'blood', function() {

    var AP = Array.prototype
      , OP = Object.prototype
      , hasOwn = OP['hasOwnProperty']
      , loops = OP['propertyIsEnumerable']
      , push = AP['push']
      , slice = AP['slice']
      , concat = AP['concat']
      , indexOf = AP['indexOf'] || function(needle, i) {
            var l = this.length;
            for (i = 0 > (i >>= 0) ? l + i : i; i < l; i++)
                if (i in this && this[i] === needle) return i;
            return -1;
        }
        
        // stackoverflow.com/a/3705407/770127
        // developer.mozilla.org/en-US/docs/ECMAScript_DontEnum_attribute
      , hasEnumBug = !loops.call({'valueOf':1}, 'valueOf') // IE8-
      , dontEnums = [
            'constructor'
          , 'propertyIsEnumerable'
          , 'valueOf'
          , 'toString'
          , 'toLocaleString'
          , 'isProtoypeOf'
          , 'hasOwnProperty'
        ]
      
      , proto = '__proto__'
      , supportsProto = proto in OP
      , owns = supportsProto ? hasOwn : function(key) {
            return proto === key ? this === OP : hasOwn.call(this, key);
        }
        
        /**
         * @param  {*}             ob
         * @param  {string|number} key
         * @return {boolean}
         */
      , has = function(ob, key) {
            return owns.call(ob, key);
        }

      , keys = !hasEnumBug && Object.keys || function(ob) {
            var k, i = 0, list = [], others = dontEnums;
            for (k in ob)
                has(ob, k) && (list[i++] = k);
            if (ob !== OP)
                for (i = others.length; i--;)
                    has(ob, k = others[i]) && admit(list, k);
            return list;
        }

      , props = !hasEnumBug && Object.getOwnPropertyNames || function(ob) {
            // getOwnPropertyNames cannot be emulated exactly. Get as close as possible.
            // Include 'length' if owned and non-enumerable, such as for native arrays.
            var props = keys(ob);
            has(ob, 'length') && !loops.call(ob, 'length') && props.push('length');
            return props;
        }
        
        /**
         * @param {Object} ob
         * @param {*=}     value
         * @param {Array=} list
         */
      , revalue = function(ob, value, list) {
            var i;
            if (list) for (i = list.length; i--;) list[i] in ob && (ob[list[i]] = value);
            else for (i in ob) ob[i] = value; // All enumerables.
            return ob;
        }
        
      , nativeCreate = (function(oCreate) {
            try {
                // Object.create(null) should inherit NO properties.
                // Object.create(func) should inherit from Function.
                if (!oCreate(null)['valueOf'] && oCreate.call === oCreate(oCreate).call)
                    return oCreate; // Return reference if implementation seems proper.
            } catch (e) {}
        }(Object.create))

      , create = nativeCreate || (function(emptyProto) {
            /**
             * @link   github.com/kriskowal/es5-shim/pull/132
             * @link   github.com/kriskowal/es5-shim/issues/150
             * @link   github.com/kriskowal/es5-shim/pull/118
             * @param  {Object|Array|Function|null}  parent
             * @return {Object}
             */
            return function(parent) {
                function F() {}
                F.prototype = null === parent ? emptyProto : parent;
                var instance = new F; // inherits F.prototype
                null === parent || (instance[proto] = parent); // hack getPrototypeOf in IE8-
                return instance;
            };
        }(combine([proto].concat(dontEnums), [null])))

      , getPro = Object.getPrototypeOf || function(ob) {
            return void 0 !== ob[proto] ? ob[proto] : (ob.constructor || Object).prototype; 
        }

      , setPro = function(ob, pro) {
            ob[proto] = pro; // experimental
            return ob;
        };

    /**
     * @param  {Object|Array|Function}          receiver
     * @param  {(Object|Array|Function)=}       supplier
     * @param  {(Array|string|number|boolean)=} list
     */
    function adopt(receiver, supplier, list) {
        var i = arguments.length, force = null != (false === list ? list = null : list);
        1 === i && (supplier = receiver, receiver = this);
        list = force && true !== list ? (typeof list != 'object' ? [list] : list) : keys(supplier);
        i = list.length;
        for (i = 0 < i && i; i--;) {
            if (force || !has(receiver, list[i]))
                receiver[list[i]] = supplier[list[i]];
        }
        return receiver;
    }

    /**
     * @param  {Object|Array|Function} receiver
     * @param  {Object|Array|Function} supplier
     */
    function assign(receiver, supplier) {
        // Functionally like the ES6 Object.assign expectation, plus single-param syntax
        1 === arguments.length && (supplier = receiver, receiver = this);
        return adopt(receiver, supplier, keys(supplier));
    }
    
    /**
     * @param  {Object|Array|Function} ob
     * @param  {Object|null}           pro
     */
    function line(ob, pro) {
        return 2 == arguments.length ? setPro(ob, pro) : getPro(ob);
    }

    /**
     * @param  {Object}  source
     * @return {Object}
     */
    function orphan(source) {
        return source ? assign(create(null), source) : create(null);
    }

    /**
     * @param  {Object|Array|Function|null} source
     * @param  {(Object|null)=}             parent
     */
    function twin(source, parent) {
        var n = arguments.length;
        source = n ? source : this;
        parent = 2 == n ? parent : getPro(source);
        return adopt(create(parent), source, props(source));
    }
    
    // Use .every/.some/.reduce/.map for array-likes.
    // Use .all/.any/.inject/.collect for NON-array-likes.

    /**
     * @param  {Object|Function} ob
     * @param  {Function=}       fn
     * @param  {*=}              scope
     */
    function all(ob, fn, scope) {
        var list = keys(ob), l = list.length, i = 0;
        while (i < l) if (!fn.call(scope, ob[list[i]], list[i++], ob)) return false;
        return true;
    }
    
    /**
     * @param  {Object|Function} ob
     * @param  {Function=}       fn
     * @param  {*=}              scope
     */
    function any(ob, fn, scope) {
        var list = keys(ob), l = list.length, i = 0;
        while (i < l) if (fn.call(scope, ob[list[i]], list[i++], ob)) return true;
        return false;
    }
    
    /**
     * @param  {Object|Array} ob
     * @param  {Function=}    fn
     * @param  {*=}           scope
     */
    function every(ob, fn, scope) {
        var l = ob.length, i = 0;
        while (i < l) if (!fn.call(scope, ob[i], i++, ob)) return false;
        return true;
    }
    
    /**
     * @param  {Object|Array} ob
     * @param  {Function=}    fn
     * @param  {*=}           scope
     */
    function some(ob, fn, scope) {
        var l = ob.length, i = 0;
        while (i < l) if (fn.call(scope, ob[i], i++, ob)) return true;
        return false;
    }
    
    /**
     * @param  {Object|Array|Arguments} ob
     * @param  {Function}               accum
     * @param  {*=}                     value
     * @param  {*=}                     scope
     */
    function reduce(ob, accum, value, scope) {
        var i = 0, l = ob.length;
        value = 3 > arguments.length ? ob[i++] : value;
        while (i < l) value = accum.call(scope, value, ob[i], i++, ob);
        return value;
    }
    
    /**
     * @param  {Object|Function}        ob
     * @param  {Function}               accum
     * @param  {*=}                     value
     * @param  {*=}                     scope
     */
    function inject(ob, accum, value, scope) {
        var list = keys(ob), i = 0, l = list.length;
        value = 3 > arguments.length ? ob[list[i++]] : value;
        while (i < l) value = accum.call(scope, value, ob[list[i]], list[i++], ob);
        return value;
    }
    
    /**
     * @param  {Object|Function|Array} ob
     * @return {Array}
     */
    function tree(ob) {
        var chain = [ob];
        while (null != (ob = getPro(ob))) chain.push(ob);
        return chain;
    }
    
    /**
     * @param  {Object|Function|Array} ob
     * @return {Array}
     */
    function roots(ob) {
        return tree(ob).slice(1);
    }

    /**
     * @param  {Array|Object} list
     * @param  {*=}           value
     * @return {Array|Object}
     */
    function admit(list, value) {
        ~indexOf.call(list, value) || push.call(list, value);
        return list;
    }
    
    /**
     * @param  {Array|Object} list
     * @return {Array}
     */
    function uniq(list) {
        return reduce(list, admit, []);
    }

    /**
     * @param  {*}  ob
     * @return {number}
     */
    function size(ob) {
        return null == ob ? 0 : (ob.length === +ob.length ? ob : keys(ob)).length; 
    }

    /**
     * @param  {Object|Array|Function} ob
     * @return {Array}
     */
    function values(ob) {
        var list = keys(ob), i = list.length;
        while (i--) list[i] = ob[list[i]];
        return list;
    }
    
    /**
     * @param  {Object|Array|Function} ob
     * @return {Array}
     */
    function pairs(ob) {
        var list = keys(ob), i = list.length;
        while (i--) list[i] = [list[i], ob[list[i]]];
        return list;
    }
    
    /**
     * @param  {Object|Array|Arguments} keys
     * @param  {Object|Array|Arguments} values
     * @param  {*=}                     target
     * @return {Object|*}
     */
    function combine(keys, values, target) {
        return some(keys, values ? function(n, i) {
            this[n] = values[i];
        } : function(pair) {
            this[pair[0]] = pair[1];
        }, target = target || {}), target;
    }
    
    /**
     * @param  {Object|Array|Arguments} ob
     * @return {Object}
     */
    function invert(ob) {
        // return combine(values(ob), keys(ob));
        return inject(ob, function(r, v, k) {
            r[v] = k;
        }, {});
    }
    
    /**
     * like underscorejs.org/#zip
     * @return {Array}
     */
    function zip() {
        var r = [], i = 0, args = arguments, inRange = function(v) {
            return i in v || (0 < v.length && i < v.length); 
        };
        while (some(args, inRange)) r.push(pluck(args, i++));
        return r;
    }
    
    /**
     * @param  {Object|Array|Function} ob
     * @param  {string|Array}          type
     * @return {Array}
     */
    function types(ob, type) {
        var names = keys(ob), i = names.length;
        type = typeof type != 'object' ? [type] : type;
        while (i--) ~indexOf.call(type, typeof ob[names[i]]) || names.splice(i, 1);
        return names.sort();
    }
    
    /**
     * @param  {Object|Array|Function} ob
     * @return {Array}
     */
    function methods(ob) {
        return types(ob, 'function');
    }

    /**
     * @param  {Object|Array|Function} source
     * @return {Object}
     */
    function pick(source) {
        for (var r = {}, list = concat.apply(AP, slice.call(arguments, 1)), l = list.length, i = 0; i < l; i++)
            if (list[i] in source) r[list[i]] = source[list[i]];
        return r;
    }

    /**
     * @param  {Object|Array|Function} source
     * @return {Object}
     */
    function omit(source) {
        var k, r = {}, list = concat.apply(AP, slice.call(arguments, 1));
        for (k in source) ~indexOf.call(list, k) || (r[k] = source[k]);
        return r;
    }
    
    /**
     * @param  {*}        ob
     * @param  {Function} fn
     * @param  {*=}       scope
     * @return {Array}
     */
    function map(ob, fn, scope) {
        var r = [];
        return some(ob, function(v, k, ob) {
            r[k] = fn.call(scope, v, k, ob);
        }), r;
    }
    
    /**
     * @param  {*}        ob
     * @param  {Function} fn
     * @param  {*=}       scope
     * @return {Array}
     */
    function collect(ob, fn, scope) {
        var r = [];
        return any(ob, function(v, k, ob) {
            r[k] = fn.call(scope, v, k, ob);
        }), r;
    }

    /**
     * @param  {*}             ob
     * @param  {string|number} key
     * @return {Array}
     */
    function pluck(ob, key) {
        var r = [];
        return some(ob, function(v, k) {
            r[k] = v[key];
        }), r;
    }

    /**
     * @param  {Object|Array} ob
     * @param  {*}            needle
     * @return {boolean}
     */
    function include(ob, needle) {
        // Emulate _.include (underscorejs.org/#contains)
        return !!~indexOf.call(ob.length === +ob.length ? ob : values(ob), needle);
    }
    
    /**
     * @param  {*}  a
     * @param  {*=} b
     * @return {boolean}
     */
    function same(a, b) {
        // Emulate ES6 Object.is
        return a === b ? (
            0 !== a || 1/a === 1/b  // Discern -0 from 0
        ) : a !== a && b !== b;     // NaN is non-reflexive
    }

    return {
        'adopt': adopt
      , 'all': all
      , 'any': any
      , 'assign': assign
      , 'create': create
      , 'collect': collect
      , 'every': every
      , 'has': has
      , 'include': include
      , 'inject': inject
      , 'invert': invert
      , 'keys': keys
      , 'line': line
      , 'loops': loops
      , 'map': map
      , 'methods': methods
      , 'object': combine
      , 'orphan': orphan
      , 'omit': omit
      , 'owns': owns
      , 'pairs': pairs
      , 'pick': pick
      , 'pluck': pluck
      , 'props': props
      , 'reduce': reduce
      , 'roots': roots
      , 'tree': tree
      , 'twin': twin
      , 'types': types
      , 'same': same
      , 'some': some
      , 'size': size
      , 'uniq': uniq
      , 'values': values
      , 'zip': zip
    };
}));