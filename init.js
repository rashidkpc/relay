var Promise = require('bluebird');
var _ = require('lodash');
var config = require('./relay');
var loadMethods = require('./lib/load_methods.js');



module.exports = function (server) {
  // Routes and basically anything the server does at start

  function createRelayIndex () {
    console.log('Trying to create relay index');
    if (!server.plugins.elasticsearch) {
      console.log('Elasticsearch client not available, retrying in 5s');
      tryCreate();
      return;
    }
    server.plugins.elasticsearch.client.indices.create({
      index: config.index,
      body: {
        mappings: {
          event: {
            _timestamp: { enabled: true }
          }
        }
      }
    }).catch(function (e) {
      if (e.body && e.body.error.type === 'index_already_exists_exception') return;
    }).then(function (resp) {
      if (!resp) {
        console.log('Failed to create relay index. Trying again in 5s');
        tryCreate();
        return;
      }
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
    handler: require('./routes/scores.js')(server)
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