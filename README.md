# Vue Store

A simple Vue instance wrapper for use as a global store.

Because we are just using a Vue instance here we get all the same Vue functionality out of the box.


## Install

~~~
> sudo npm install @websanova/vue-store
~~~    

~~~
Vue.use(require('@websanova/vue-store'), {
    products: require('./store/products.js')
});
~~~


## Usage

The values in the store can be accessed directly any time.

~~~
this.$store.products.all();
this.$store.products.current;
~~

However we may likely want to have some context when using our store values. When using `get` and `watch` you will always have the current components scope.

~~~
this.$store.get('products.all')();
this.$store.watch('products.current', function () {});
~~~

We can also do a set call.

~~~
this.$store.set('products.current', {});
this.$store.set('products.current', function () {});
~~

If you don't like that just use your own context.

~~~
this.$store.products.all.call(this);
~~~