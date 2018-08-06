var Store = require('./store.js')();

export default function install(Vue, options) {
    var store = new Store(Vue, options);

    Vue.store = store;

    Object.defineProperties(Vue.prototype, {
        $store: {
            get: function () {
                //

                return store;
            }
        }
    });
};