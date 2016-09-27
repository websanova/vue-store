module.exports = (function () {
    return function install(Vue, data) {
        var key,
            store = new Vue();

        data = data || {};

        for (key in data) {
            store.$set(key, data[key]);
        }

        Object.defineProperties(Vue.prototype, {
            $store: {
                get: function() {
                    var _this = this;

                    store.set = function (key, val) { store.$set(key, val); return store; }
                    store.watch = function (key, func) { store.$watch(key, func.bind(_this)); return store; }
                    store.get = function (key) { return store.$get(key).bind(_this); }

                    return store;
                }
            }
        });
    }
})();