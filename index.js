var path           = require('path');
var through        = require('through2');
var _              = require('lodash');
var jsStringEscape = require('js-string-escape');

module.exports = function (options) {
    var defaults = {
        root: '',
        cacheTpl: 'cache.put("<%= url %>", "<%= contents %>");\n',
        wrapperTpl: '<%= contents %>',
        data: {}
    };
    options = _.defaults(options || {}, defaults);

    var cacheFn   = _.template(options.cacheTpl);
    var wrapperFn = _.template(options.wrapperTpl);

    var combinedFile, contents = '';

    function transform(file, enc, callback) {
        var url     = file.path,
            content = file.contents.toString(),
            ext     = path.extname(file.path),
            base    = options.base || file.base;

        if (ext === '.html' || ext === '.htm') {
            file.path = path.normalize(file.path);

            if (base.substr(-1) !== path.sep) {
                base += path.sep;
            }

            url = path.join(options.root, file.path.replace(base, '')).replace(/\\/g, '/');
        }

        if (!combinedFile) {
            combinedFile = file;
            combinedFile.path = path.join(options.root, options.base, options.name || 'cached' + ext);
        }

        contents += cacheFn(_.defaults({url : url, contents: jsStringEscape(content)}, options.data));

        callback();
    }

    function flush(callback) {
        if (combinedFile) {
            combinedFile.contents = new Buffer(wrapperFn(_.defaults({contents: contents}, options.data)));
            this.push(combinedFile);
        }
        callback();
    }

    return through.obj(transform, flush);
};