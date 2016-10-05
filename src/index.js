module.exports = (function () {
    return function install(Vue, data) {
        var key,
            store = new Vue();

        data = data || {};

        for (key in data) {
            store[key] = data[key];
        }

        function indexGet(obj, i) { return obj[i]; }
        
        function indexSet(key, val, obj) {
            if (key.length < 2) { 
                obj[key[0]] = val;
            } else {
                if (!obj[key[0]]) obj[key[0]] = {};
                
                obj = obj[key.shift()];
                
                indexSet(key, val, obj);
            }  
        }

        Object.defineProperties(Vue.prototype, {
            $store: {
                get: function() {
                    var _this = this;

                    store.set = function (key, val) { indexSet(key.split('.'), val, store); return store; }
                    store.watch = function (key, func) { store.$watch(key, func.bind(_this)); return store; }
                    store.get = function (key) {
                        var val = key.split('.').reduce(indexGet, store);

                        if (typeof val === 'function') { return val.bind(_this); }

                        return val;
                    }

                    return store;
                }
            }
        });
    }
})();