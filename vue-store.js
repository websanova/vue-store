module.exports = (function () {

    var Store = {
        data() {
            return {
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

            run(key, data, cb) {
                return this.$get('data.' + key).call(this, data, cb);
            },

            watch(key, cb) {
                this.$watch('data.' + key, cb);
            }
        }
    };

    return function install(Vue, data) {
        var store = new Vue(Store);

        store.data = data;

        Object.defineProperties(Vue.prototype, {
            $store: {
                get () { return store; }
            }
        });
    }
    
})();