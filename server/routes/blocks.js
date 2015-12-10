var loadMethods = require('../lib/load_methods.js');

module.exports = function (request, reply) {
  reply(loadMethods('blocks'));
};