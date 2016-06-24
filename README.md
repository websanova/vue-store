# vue-store

A simple light-weight Vue "store" alternative to `vuex`.


## Usage

The plugin can be initialized with an initial set of values.

```
Vue.install(require('vue-store'))
```

Or

```
Vue.use(require('vue-store'), {
    users: require('./actions/users.js')
    ...
});
```


## Methods

**`set`**

Anything can be set whether it's a variable or function.

```
this.$store.set('some.key.value', 'value');
```

The `set` function can also be chained.

```
this.$store
    .set('some.key.value', 'value')
    .set('some.other.value', 'value')
    .run('some.func');
```


**`get`**

Retrieve a value, if a function is stored, it will be returned. It will NOT be executed use `$store.run` to execute.

```
this.$store.get('some');           // Object
this.$store.get('some.key');       // Object
this.$store.get('some.key.value'); // String
```

**`clr`**

A shorthand to set the value to to `undefined`.

```
this.$store.clr('some.key');
```

Can also be chained.

```
this.$store
    .clr('some.key')
    .clr('another.key')
    .set('new.val')
    .run('some.func');
```

**`run`**

This is used to explicitly run a function stored in the store.

```
this.$store.run('some.func', data, cb);
```

**`watch`**

Set a watch on any part of a value or object.

```
this.$store.watch('some.val', function (newVal, oldVal) {
    
});
```


## Example

Below is a full-ish example of the store in action.

Require a user store on init:

```
Vue.use(require('vue-store'), {
    users: require('./actions/users.js')
});

```

Our `users` file. We can store functions and variables here:

```
module.exports = {
    state: null,
    reset: function () {
        this.clr('users.status');
        this.clr('users.data');
    },
    fetch: function (data, cb) {
        this.$http.get('users', data, function (res) {
            this.$store.set('users.data', res.data);
            this.$store.set('users.status', 'sent');

            if (cb) { cb(res.data); };
        });
    }
};
```

A sample of what a users component might look like:

```
<template>
    <div v-if="!$store.get('users.status')">
        Loading...
    </div>

    <div v-if="$store.get('users.status') === 'sent'" v-for="user in $store.get('users.data').data">
        {{ user._id }} | {{ user.email }} | <a v-on:click="loginAs(user)" href="javascript:void(0);">login as</a>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                users: []
            };
        },
        watch: {
            users() {
                console.log('local users watch');
            }
        },
        created() {
            this.$store.run('users.reset');
        },
        ready() {
            var _this = this;

            this.$store.watch('users.data', function (newVal, oldVal) {
                console.log('store users.data watch');
            });

            this.$store.watch('users.data.data', function (newVal, oldVal) {
                console.log('store users.data.data watch');
            });

            _this.$store.run('users.fetch', {page: 1}, function (data) {
                _this.users = data;
            });
        }
    }
</script>
```