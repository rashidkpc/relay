var Promise = require('bluebird');
var fetch = require('node-fetch');
var CronJob = require('cron').CronJob;
var _ = require('lodash');

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'http://localhost:9200/'
});
var config = require('./relay.json');



module.exports = function (server) {
  // Routes and basically anything the server does

  var index = '.gitboard_events';

  new CronJob('5 */2 * * * *', function () {
    console.log('Every 2 minutes index github api');
    indexGithubAPI();
  }, null, true);

  client.indices.create({
    index: index,
    body: {
      mappings: {
        event: {
          _ttl: { enabled : true, 'default': '1d' },
          _timestamp: { enabled: true }
        }
      }
    }
  }).catch(function (e) {
    if (e.body.error.type !== 'index_already_exists_exception') throw e;
  });

  function indexGithubAPI() {

    var endpoint = 'orgs/elastic/events';
    var URL = 'https://api.github.com/' + endpoint;
    return fetch(URL).then(function (resp) { return resp.json(); }).then(function (resp) {

      _.each(resp, function (event) {
        client.create({
          index: index,
          type: 'event',
          id: event.id,
          body: event,
          timestamp: event.created_at,
          ttl: '1d'
        });
      });
    });
  }

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