'use strict';

var _       = require('lodash'),
    config  = require('./config.json'),
    fs      = require('fs-extra'),
    Layers  = require('image-layers'),
    path    = require('path');

var args      = process.argv || [],
    root_path = 'resources',
    target    = _.trimEnd(args[args.length - 1] || '', ' /\\');

if (args.length < 3 || !target) {
  console.log('Missing target resources path');
  process.exit();
}

if (target.substr(target.length - root_path.length) !== root_path) {
  target += '/' + root_path;
}

_.forEach(config.platforms, function(resources, platform) {
  _.forEach(resources, function(resource, type) {
    var source = target + resource.source;
    _.forEach(resource.targets, function(size, name) {
      var arr_size = size.split('x'),
          filename = [target, platform, type, name].join('/') + '.' + config.format.target;
      render(source, filename, parseInt(arr_size[0]), parseInt(arr_size[1] || arr_size[0]));
    });
  });
});

/**
 * Render image
 */
function render(source, filename, width, height) {
  var image = new Layers(width, height);
  image.add(source)
       .position('center center')
       .size('cover');
  fs.ensureDirSync(path.dirname(filename));
  image.save(filename).then(function() {
    console.log('Generated ' + path.basename(filename) + ' successfully');
  }).catch(function(err) {
    console.log('Failed to save ' + path.basename(filename), err);
  });
}