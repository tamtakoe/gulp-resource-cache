# gulp-resource-cache [![NPM version](https://badge.fury.io/js/gulp-resource-cache.svg)](http://badge.fury.io/js/gulp-resource-cache)

> Concatenating and wrapping resources to cache

## Install with [npm](npmjs.org)

```sh
npm install gulp-resource-cache
```

## Usage

```js
gulp.src('*.html')
    .pipe(gulpResourceCache({wrapperTpl: 'function(){ var cache = window.cache; <%= contents %> }', name: 'templates.html'}))
    .pipe(gulp.dest('compiled'));
```

You get merged file:

```js
function(){ var cache = window.cache;
    cache.put("templates/template1.html", "<div>Template 1</div>");
    cache.put("templates/template2.html", "<div>Template 2</div>");
    cache.put("templates/template3.html", "<div>Template 3</div>");
}
```

Note: you need defined `cache.put` method in your application.

You can define `wrapperTpl` for any case and any frameworks.
    amd:                  `define("<%= name %>", [], function(){ var cache = window.cache; <%= contents %> });`
    angularTemplateCache: `angular.module("<%= name %>").run(["$templateCache", function(cache) {<%= contents %> }]);`,
    angularHttpCache:     `angular.module("<%= name %>").run(["$cacheFactory", function($cacheFactory) {var cache = $cacheFactory.get("$http"); <%= contents %> }]);`,
    etc.
        

## API
### gulpResourceCache(params)

#### params
Object with the following parameters

##### root
Type: `String`

Default: `''`

Root path for resource url `cache.put(root + url, content)`

##### base
Type: `String`

Default: `file.base`

Base path for resource url. It is subtracted from the address of the resource

##### name
Type: `String`

Default: `'cached' + extention`

Merged file name


##### cacheTpl
Type: `String`

Default: `'cache.put("<%= url %>", "<%= contents %>");\n'`

Cached resource [template](https://lodash.com/docs#template)

##### wrapperTpl
Type: `String`

Default: `'<%= contents %>'`

Wrapper [template](https://lodash.com/docs#template)

##### data
Type: `Object`

Custom data for `cacheTpl` and `wrapperTpl`


## License

© Oleg Istomin 2015. Released under the MIT license