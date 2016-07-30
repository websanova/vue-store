module.exports = (function () {

    var Store = {
        data() {
            return {
                __ctx: null,
                data: {}
            };
        },
        methods: {
            set(key, val) {
                this.$set('data.' + key, val);

                return this;
            },

            get(key) {
                return this.$get('data.' + key);
            },

            clr(key) {
                this.$set('data.' + key, undefined);

                return this;
            },

            run(key) {
                var args = Array.prototype.slice.call(arguments, 1);

                this.$get('data.' + key).apply(this.__ctx, args);

                return this;
            },

            watch(key, cb) {
                this.$watch('data.' + key, function (newVal, oldVal) {
                    cb.call(this.__ctx, newVal, oldVal);
                });

                return this;
            }
        }
    };

    return function install(Vue, data) {
        var store = new Vue(Store);

        store.data = data;

        Object.defineProperties(Vue.prototype, {
            $store: {
                get () {
                    store.__ctx = this;

                    return store;
                }
            }
        });
    }
    
})();