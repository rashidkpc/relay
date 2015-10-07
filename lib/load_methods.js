var _ = require('lodash');
var glob = require('glob');
var path = require('path');

module.exports = function loadMethods(type) {
  var blocks = _.chain(glob.sync(path.resolve(__dirname, '../' + type + '/*.js'))).map(function (file) {
    var fnName = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.'));
    var block = require('../' + type + '/' + fnName + '.js');

    // TODO: This is pure abuse, move this to the call to load blocks, I think there's only 1 that cares about _name;
    if (block.fn) {
      var filterType = _.keys(block.fn.filter)[0];
      block.fn.filter[filterType]._name = block.name;
    }

    return block;
  }).value();

  return blocks;
};