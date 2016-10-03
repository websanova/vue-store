module.exports = (function () {
    return function install(Vue, data) {
        var key,
            store = new Vue();

        data = data || {};

        for (key in data) {
            Vue.set(store, key, data[key]);
        }

        Object.defineProperties(Vue.prototype, {
            $store: {
                get: function() {
                    var _this = this;

                    store.set = function (key, val) { Vue.set(store, key, val); return store; }
                    store.watch = function (key, func) { store.$watch(key, func.bind(_this)); return store; }
                    store.get = function (key) { return store[key].bind(_this); }

                    return store;
                }
            }
        });
    }
})();