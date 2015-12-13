var Promise = require('bluebird');
var _ = require('lodash');
var config = require('./relay');
var loadMethods = require('./server/lib/load_methods.js');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: config.elasticsearch.host,
});

var dynamicTemplates = [ {
  string_fields : {
    mapping : {
      type : 'multi_field',
      doc_values: true,
      fields : {
        search : {
          index : 'analyzed',
          omit_norms : true,
          type : 'string',
        },
        '{name}' : {
          index : 'not_analyzed',
          type : 'string',
          doc_values: true,
        }
      }
    },
    match_mapping_type : 'string',
    match : '*'
  }
}];

module.exports = function (server) {
  // Routes and basically anything the server does at start

  function createRelayIndex () {
    console.log('Trying to create relay index');
    if (!server.plugins.elasticsearch) {
      console.log('Elasticsearch client not available, retrying in 5s');
      tryCreate();
      return;
    }

    client.indices.putTemplate({
        name: config.index,
        body: {
        template: config.index + '*',
        settings: {
          number_of_shards: 2,
          number_of_replicas: 0
        },
        mappings: {
          _default_: {
            dynamic_templates : dynamicTemplates,
            properties: {
              '@timestamp': { type: 'date', doc_values: true },
              '__relay_actor': { type: 'string', doc_values: true, index: 'not_analyzed' },
              '__relay_scores': {
                type: 'nested',
                properties: {
                  name: { type: 'string', doc_values: true, index: 'not_analyzed' },
                  score: { type: 'double' }
                }
              }
            }
          }
        }
      }
    })
    .catch(e => {
      console.log('Error storing template', e);
    })
    .then((err, resp) => {
      console.log('Template created, starting sources');
      var sources = loadMethods('../sources/*');
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