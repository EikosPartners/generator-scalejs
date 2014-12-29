
module.exports = ( grunt, options ) ->

    _package = options.package.name
    _version = options.package.version

    _name = _package + '-' + _version

    dist:
        files:
            'build/' + _name + '.min.js': ['build/' + _name + '.js']

