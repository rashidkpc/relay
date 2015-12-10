var Promise = require('bluebird');
var _ = require('lodash');
var config = require('./relay');
var loadMethods = require('./lib/load_methods.js');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: config.elasticsearch.host,
});


module.exports = function (server) {
  // Routes and basically anything the server does at start

  function createRelayIndex () {
    console.log('Trying to create relay index');
    if (!server.plugins.elasticsearch) {
      console.log('Elasticsearch client not available, retrying in 5s');
      tryCreate();
      return;
    }
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
      console.log(e);
      if (e.body && e.body.error.type === 'index_already_exists_exception') return;
    }).then(function (resp) {
      console.log(resp);

      console.log('Index created, starting sources');
      var sources = loadMethods('sources');
      _.each(sources, function (source) {
        source.start(server);
      });
    });
  }

  function tryCreate () {
    setTimeout(createRelayIndex, 5000);
  }
  createRelayIndex();


  server.route({
    method: 'GET',
    path: '/relay/scores',
    handler: require('./server/routes/scores.js')(server)
  });

  server.route({
    method: 'GET',
    path: '/relay/blocks',
    handler: require('./server/routes/blocks.js')
  });

  server.route({
    method: 'GET',
    path: '/relay/config',
    handler: require('./server/routes/config.js')
  });
};