/*!
 * blood        inheritance module
 * @link        github.com/ryanve/blood
 * @license     MIT
 * @copyright   2013 Ryan Van Etten
 * @version     0.x
 */

/*jslint browser: true, devel: true, node: true, passfail: false, bitwise: true
, continue: true, debug: true, eqeq: true, es5: true, forin: true, newcap: true
, nomen: true, plusplus: true, regexp: true, undef: true, sloppy: true, stupid: true
, sub: true, white: true, indent: 4, maxerr: 100 */

(function (root, name, definition) {// github.com/umdjs/umd
    if ( typeof module != 'undefined' && module.exports ) {
        module.exports = definition();
    } else { root[name] = definition(); }
}(this, 'blood', function () {

    return {
    
        'parent': Object.getPrototypeOf || function (ob) {
            if ( void 0 !== ob['__proto__'] ) { return ob['__proto__']; }
            return (ob.constructor || Object).prototype;
        }
    
      , 'child': (function (oCreate) {

            try {
                // Return reference Object.create when it works:
                // Object.create(null) should inherit no properties.
                // Object.create(func) should inherit from Function.
                return !oCreate(null).toString && !!oCreate(oCreate).call && oCreate; 

            } catch (e) {

                // Cache a stripped instance for quasi-emulating Object.create(null) in IE8-. 
                // {"__proto__": null} should inherit nothing. IE8- inherits Object.prototype.
                // Strip the instance by overriding its existing props to undefined.
                // Re: github.com/kriskowal/es5-shim/pull/132

                var stripped = (function () {
                    var k, o = {'__proto__': null}
                      , list = ['propertyIsEnumerable', 'valueOf', 'toString',
                                'toLocaleString', 'isProtoypeOf', 'hasOwnProperty'];
                    for ( k in o ) { o[k] = void 0; } // Void Object.prototype alterations.
                    while ( k = list.pop() ) { k in o && (o[k] = void 0); } // Non-enumerables.
                    return o;
                }());
                
                return function (parent) {
                    /** @constructor */ 
                    function F () {}
                    F.prototype = null === parent ? stripped : parent;
                    var object = new F; // Get empty instance that inherits `parent`
                    object['__proto__'] = parent; // Help `Object.getPrototypeOf` work in IE.
                    return object;
                };
            }
        }(Object.create))

    };
    
}));