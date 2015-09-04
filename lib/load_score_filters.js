var _ = require('lodash');
var glob = require('glob');
var path = require('path');

module.exports = function loadScoreFilters() {
  var blocks = _.chain(glob.sync(path.resolve(__dirname, '../blocks/*.js'))).map(function (file) {
    var fnName = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.'));
    var block = require('../blocks/' + fnName + '.js');

    var filterType = _.keys(block.fn.filter)[0];
    block.fn.filter[filterType]._name = block.name;

    return block;
  }).value();

  return blocks;
};