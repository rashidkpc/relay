var _ = require('lodash');
var glob = require('glob');
var path = require('path');

module.exports = directory => {
  return _.chain(glob.sync(path.resolve(__dirname,  directory + '/*.js')))
  .map(file => require(file)).value();
};