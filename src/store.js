module.exports = function () {

    var __store;

    var __defaultOptions = {
        http: __http,
        httpEmpty: __httpEmpty,
        parseSuccessResponse: __parseSuccessResponse,
        parseErrorResponse: __parseErrorResponse
    };

    function __isObject(data) {
        if (data && typeof data === 'object' && data.constructor !== Array) {
            return true;
        }

        return false;
    }

    function __merge(current, update) {
        Object.keys(update).forEach(function(key) {
            if (
                current.hasOwnProperty(key) 
                && typeof current[key] === 'object'
                && !(current[key] instanceof Array)
            ) {
                __merge(current[key], update[key]);
            }
            else {
                current[key] = update[key];
            }
        });

        return current;
    }

    function __isEmpty(data) {
        if (
            data === undefined ||
            data === null ||
            data === '' ||
            (data.constructor === Array && !data.length) ||
            (typeof data === 'object' && !Object.keys(data).length)
        ) {
            return true;
        }

        return false;
    }

    function __http(options) {
        var http = __store.Vue.http(options);

        http.then(options.success, options.error);

        return http;
    }

    function __httpEmpty() {
        return {
            then: function(){},
            catch: function(){},
            success: function(){},
            error: function(){},
            finally: function(){}
        };
    }

    function __parseSuccessResponse(res) {
        return res.data.data;
    }

    function __parseErrorResponse(res) {
        return res.data.errors || [{rule: res.data.code, msg: res.data.msg}];
    }

    function __options(key, url, options) {
        options = (__isObject(url) ? url : options) || {url: url};

        options.key = key;

        options.success = function (res) {
            _set(options.key, options.response ? options.response(res) : __store.options.parseSuccessResponse(res));

            __store.instances[options.key].$vm.state = 'success';
            
            _state(options.key);
        }

        options.error = function (res) {
            __store.instances[options.key].$vm.errors = __store.options.parseErrorResponse(res);

            __store.instances[options.key].$vm.state = 'error';

            _state(options.key);
        }

        return options;
    }

    function _init(name) {
        if (__store.instances[name] !== undefined) {
            return;
        }

        __store.Vue.set(__store.$vm.instances, name, {
            state: 'ready',

            isEmpty: null,

            isReady: true,
            isError: false,
            isSuccess: false,
            isLoading: false,
            isLoadingSilent: false,
            isLoaded: false,

            error: {},
            errors: []
        });

        __store.instances[name] = {
            key: name,

            $data: _set(name, {}),

            $vm: __store.$vm.instances[name]
        };
    }

    function _call(options) {
        __store.instances[options.key].$vm.state = (__store.instances[options.key].$vm.isLoaded && options.silent) ? 'loading-silent' : 'loading';

        _state(options.key);

        return __store.options.http(options);
    }

    function _reset(name) {
        if (__store.instances[name]) {
            __store.instances[name].$vm.state = 'ready';

            _state(name);
        }

        _set(name, null);
    }

    function _state(name) {
        var vm = __store.instances[name].$vm;

        vm.isEmpty = __isEmpty(__store.instances[name].$data);

        vm.isReady = vm.state === 'ready' ? true : false;
        vm.isLoading = vm.state === 'loading' ? true : false;
        vm.isLoadingSilent = vm.state === 'loading-silent' ? true : false;
        vm.isError = vm.state === 'error' ? true : false;
        vm.isSuccess = vm.state === 'success' ? true : false;
        vm.isLoaded = vm.state === 'success' ? true : false;
    }

    function _get(name, def) {
        var i, ii,
            obj = __store.$vm.data,
            parts = (name || '').split('.');

        for (i = 0, ii = parts.length; i < (ii - 1); i++) {
            if (!__isObject(obj[parts[i]])) {

                return undefined;
            }

            obj = obj[parts[i]];
        }

        return obj[parts[i]] !== undefined ? obj[parts[i]] : def;
    }

    function _set(name, data) {
        var i, ii,
            obj = __store.$vm.data,
            parts = (name || '').split('.');

        for (i = 0, ii = parts.length; i < (ii - 1); i++) {
            if (!__isObject(obj[parts[i]])) {
                __store.Vue.set(obj, parts[i], {});
            }

            obj = obj[parts[i]];
        }

        if (__isObject(obj[parts[i]]) && __isObject(data)) {
            data = __merge(obj[parts[i]], data);
        }
        
        __store.Vue.set(obj, parts[i], data);

        return obj[parts[i]];
    }

    function Store(Vue, options) {
        this.options = Object.assign({}, __defaultOptions, options);

        this.Vue = Vue;

        this.$vm = new Vue({
            data: function() {
                return {
                    instances: {},

                    data: {}
                };
            }
        });

        this.instances = {};

        __store = this;
    }

    Store.prototype.fetch = function (name, url, options) { 
        options = __options(name, url, options);

        _init(name);

        if (
            !__store.instances[name].$vm.isLoading &&
            !__store.instances[name].$vm.isLoadingSilent
        ) {
            return _call(options);
        }

        return __store.options.httpEmpty(); // empty promise :-(
    };

    Store.prototype.silent = function (name, url, options) { 
        options = __options(name, url, options);

        options.silent = true;

        return __store.fetch.call(this, name, options);
    };

    Store.prototype.once = function (name, url, options) {
        options = __options(name, url, options);

        _init(name);

        if (
            !__store.instances[name].$vm.isLoaded &&
            !__store.instances[name].$vm.isLoading &&
            !__store.instances[name].$vm.isLoadingSilent
        ) {
            return _call(options);
        }
        
        return __store.options.httpEmpty(); // empty promise :-(
    };

    Store.prototype.state = function (name) {
        _init(name);

        return __store.instances[name].$vm.state;
    };

    Store.prototype.isEmpty = function (name) {
        _init(name);

        return __store.instances[name].$vm.isEmpty;
    };

    Store.prototype.isReady = function (name) {
        _init(name);

        return __store.instances[name].$vm.isReady;
    };

    Store.prototype.isLoading = function (name) {
        _init(name);

        return __store.instances[name].$vm.isLoading;
    };

    Store.prototype.isLoadingSilent = function (name) {
        _init(name);

        return __store.instances[name].$vm.isLoadingSilent;
    };

    Store.prototype.isError = function (name) {
        _init(name);

        return __store.instances[name].$vm.isError;
    };

    Store.prototype.isSuccess = function (name) {
        _init(name);

        return __store.instances[name].$vm.isSuccess;
    };

    Store.prototype.loaded = function (name) {
        _init(name);

        return __store.instances[name].$vm.isLoaded;
    };

    Store.prototype.errors = function (name) {
        _init(name);

        return __store.instances[name].$vm.errors;
    };

    Store.prototype.get = function (name, def) {
        return _get(name, def);
    };

    Store.prototype.set = function (name, data) {
        return _set(name, data);
    };

    Store.prototype.reset = function (name) {
        _reset(name);
    }

    return Store;
};