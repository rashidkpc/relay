var Promise = require('bluebird');
var _ = require('lodash');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'http://localhost:9200/'
});
//var config = require('./relay.json');
var loadMethods = require('./lib/load_methods.js');
var config = {}


module.exports = function (server) {
  // Routes and basically anything the server does at start

  client.indices.create({
    index: config.index,
    body: {
      mappings: {
        event: {
          _timestamp: { enabled: true }
        }
      }
    }
  }).catch(function (e) {
    if (e.body.error.type !== 'index_already_exists_exception') throw e;
  }).then(function () {
    var sources = loadMethods('sources');
    _.each(sources, function (source) {
      source.start(server);
    });
  });

  server.route({
    method: 'GET',
    path: '/relay/scores',
    handler: require('./routes/scores.js')
  });

  server.route({
    method: 'GET',
    path: '/relay/blocks',
    handler: require('./routes/blocks.js')
  });

  server.route({
    method: 'GET',
    path: '/relay/config',
    handler: require('./routes/config.js')
  });
};