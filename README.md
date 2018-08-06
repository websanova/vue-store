# Vue Store

A simple easy access store utility for Vue.js

This is an alternative to Vuex which requires a lot more bootstrapping and centralization.

This plugin makes the store more accessible easy access methods like `set`, `get`, `fetch`, `once`, `silent`, etc.



## Install

```bash
$ sudo npm install @websanova/vue-upload
``` 

Require in the project.

```javascript
import vueUpload from '@websanova/vue-upload';

Vue.use(vueUpload);
```

OR

```javascript
Vue.use(require('@websanova/vue-upload').default);
```


## Usage

### General

Note that we can can access the store using `Vue.store` (no instance) or via a component instance with `this.$store`.

When using http methods like `fetch` and `once` it will always return the promise from the given library (such as vue-resource or axios).

### Dot Notation

The plugin supports dot notation for all methods.

~~~javascript
this.$store.set('users.list.one', 'hello');
~~~

If we were to do a get on `users` we would get back an object.

~~~javascript
this.$store.get('users'); // {list: {one: 'hello'}}
~~~

### States

When making a request with `once`, `fetch` or `silent` the request will set one of the following states.

`ready` - on init or reset.

`loading` - when making the request.

`loading-silent` - when making the request in silent mode.

`success` - response is successful.

`error` - response is an error.



## Examples

### Fetching Data

We could of course run an http call and have a simple store with just a `set` and `get` method. Methods like `once` and `fetch` just serve as nice little shortcuts to avoid this hassle.

~~~
<template>
    <div>
        <div v-show="$store.isLoading('users.list')">
            Loading users...
        </div>

        <div v-show="!$store.isEmpty('users.list')">
            <ul>
                <li v-for="user in $store.get('users.list')">
                    {{ user.name }}
                </li>
            </ul>
        </div>

        <div v-show="$store.isEmpty('users.list')">
            No users found...
        </div>

        <div v-show="$store.isError('users.list')">
            Error fetching users...
        </div>
    </div>
</template
~~~

~~~javascript
    mounted() {
        this.$store.fetch('users.list', 'users');
    }
~~~

### Initializing

It may be good practice to include the store plugin in an initial bootstrap and then create a "store" file or set of files to init. This would then serve to organize things a bit, but it's just an arbitrary way of organizing things.

We could then have a store file.

~~~javascript
Vue.store.set('props', {
    auth: {
        loginRedirect: 'some/loing/route',
        logoutRedirect: some/logout/route
    },

    site: {
        logo: 'path/to/logo'
    }
});

Vue.store.set('users', {
    defaultAvatar: 'path/to/avatar'
});
~~~

We could then load some additional back-end properties on the main component boot.

This would then automatically merge with our front end props.

Using `once` also ensures this route will only ever get called once even if we make the call again.

~~~javascript

    computed: {
        _loaded() {
            return this.$store.loaded('props');
        }
    },

    created() {
        this.$store
            .once('props')
            .then((res) => {
                console.log(this); // proper context
            });
    }

    ...
~~~



## Methods

### `set(name, data)`

Set a value in the store.

> **Note:** This will do a deep merge on the object overriding any existing values.

~~~javascript
this.$store.set('some.value.deep.inside', 'here');

this.$store.set('some.value', {deep: {inside: 'here'}});
~~~

### `get(name)`

Get a value in the store.

~~~javascript
this.$store.set('some.value.deep.inside', 'here');

this.$store.get('some.value'); // {deep: {inside: 'here'}}
~~~

### `reset(name, [url], [options])`

Reset the store value to `null` and clear out any states.

~~~
this.$store.reset('some.value');

this.$store.get('some.value'); // null
~~~

### `fetch(name, [url], [options])`

Makes an http request, sets `state` and puts the response data into the store if successful.

> **Note:** This uses the `parseSuccessResponse` and `parseErrorResponse` options for parsing the responses.
> **NOTE:** This uses the `http` option for making http requests and should return the "promise" object.

~~~javascript
this.$store
    .fetch('some.data', 'some.url')
    .then(() => {
        console.log('success');
    }, () => {
        console.log('error');
    })
~~~

Note that the second parameter is the `url` but we can also just pass an object there.

~~~javascript
this.$store
    .fetch('some.data', {
        url: 'some.url'
    });
~~~

There are also too other optional options that can be set.

~~~javascript
this.$store
    .fetch('some.data', {
        url: 'some.url',
        silent: true
        response(res) { return res.data; }
    });
~~~

`silent` - make a request without changing to a `loading` or `loading-silent` state. The request can then be made to appear as it's running in the background and only update the list in real time (without spinners, etc).

`response` - set an alternate parsing to the default `parseSuccessReponse` option.

### `silent(name, [url], [options])`

A shortcut for calling `fetch` with the silent option.

~~~javascript
this.$store
    .fetch('some.data', {
        url: 'some.url',
        silent: true
    });
~~~

### `once(name, [url], [options])`

Ensures the requested url only gets called once.

> **NOTE:** Check `fetch` for more details on usage.

~~~javascript
this.$store.once('some.data', 'users');

this.$store.once('some.data', 'users'); // Nothing happens

this.$store.reset('some.data');

this.$store.once('some.data', 'users'); // Works again
~~~

### `state(name)`

Returns the state of the request on that object parameter.

Check `states` under `usage` section for more information about states.

> **NOTE:** This is only meant to be used specifically on the object parameter the request was made on using `once`, `fetch`, etc.

~~~javascript
this.$store.fetch('some.data', 'some/url');

this.$store.state('some.data'); // 'success'
~~~

### `isEmpty(name)`

A helper method for checking if a given object is empty.

> **NOTE:** This is only meant to be used specifically on the object parameter the request was made on using `once`, `fetch`, etc.

### `isReady(name)`

Shortcut method for checking "ready" state.

### `isLoading(name)`

Shortcut method for checking "loading" state.

### `isLoadingSilent(name)`

Shortcut method for checking "loading-silent" state.

### `isSuccess(name)`

Shortcut method for checking "success" state.

### `isError(name)`

Shortcut method for checking "error" state.

### `loaded`

Alternate method to `isSuccess` for checking "success" state.

> **NOTE:** This is mainly for syntax sugaring as `$store.loaded('props')` just looks a bit nicer.

### `errors`

Return errors from response formatted by `parseErrorResponse` option.



## Options

### `http`

Set the http processor to use. By default assume `Vue.http` via `vue-resource`.

### `parseSuccessResponse`

Parse the success response. By default returns `res.data.data`.

### `parseErrorResponse`

