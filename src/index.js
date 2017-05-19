module.exports = (function () {

    function isObject(val) {
        if (val !== null && typeof val === 'object' && val.constructor !== Array ) {
            return true;
        }

        return false;
    }

    function _toCamelCase(val) {
        return val.replace(/^([A-Z])|[\s-_:](\w)/g, function(match, p1, p2, offset) {
            if (p2) {
                return p2.toUpperCase();
            }
            
            return p1.toLowerCase();        
        });
    }

    function _getObj(name) {
        var i, ii, obj;

        name = _init.call(this, name).split('.');

        obj = this.watch.data;

        for (i = 0, ii = name.length; i < ii; i++ ) {
            obj = obj[name[i]];

            if ( ! obj) {
                return undefined;
            }
        }

        return obj;
    }

    function _init(name) {
        var i, ii, obj, _name;

        _name = name.split('.');

        obj = this.watch.data;

        for (i = 0, ii = _name.length; i < ii; i++) {
            if ( ! obj[_name[i]]) {

                // If last one.
                if (i + 1 === ii) {
                    this.options.Vue.set(obj, _name[i], undefined);
                }
                else {
                    this.options.Vue.set(obj, _name[i], {});
                }
            }

            obj = obj[_name[i]];
        }

        return name;
    }

    function Toggle(values, options) {
        this.options = options;

        this.watch = new options.Vue({
            data: function () {
                return {
                    data: values || {}
                };
            }
        });
    }

    Toggle.prototype.set = function (key, val) {
        var i, ii,
            obj = this.watch.data,
            name = _init.call(this, key).split('.');

        for (i = 0, ii = name.length; i < ii; i++) {
            if (i + 1 === ii) {
                this.options.Vue.set(obj, name[i], val);
            }
            else {
                obj = obj[name[i]];
            }
        }
    };

    Toggle.prototype.get = function (key) {
        var obj = _getObj.call(this.$store, key);

        if (typeof obj === 'function') {
            return obj.bind(this);
        }

        return obj;
    };

    Toggle.prototype.find = function (haystack, needle, key) {
        var i, ii,
            obj = _getObj.call(this, haystack);

        key = key || 'id';

        if (obj.constructor === Array) {
            for (i = 0, ii = obj.length; i < ii; i++) {
                if (obj[i][key] === needle) {
                    return obj[i];
                }
            }
        }

        else if (isObject(obj)) {
            for (i in obj) {
                if (obj[i][key] === needle) {
                    return obj[i];
                }
            }
        }

        return undefined;
    }

    return function install(Vue, values, options) {
        var store,
            _get;

        options = options || {};

        options.Vue = Vue;

        store = new Toggle(values, options),
        _get = store.get;

        Object.defineProperties(Vue.prototype, {
            $store: {
                get: function() {
                    store.get = _get.bind(this);

                    return store;
                }
            }
        });
    }
})();