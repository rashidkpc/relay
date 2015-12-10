var Source = require('../lib/source.js');
var CronJob = require('cron').CronJob;
var config = require('../relay.json');
var fetch = require('node-fetch');
var _ = require('lodash');

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: config.elasticsearch.host,
});



module.exports = new Source('Github', {
  start: function github(server) {
    console.log('Starting Github indexer');
    new CronJob('5 */2 * * * *', function () {
      console.log('Every 2 minutes index github api');
      indexGithubAPI();
    }, null, true);

    function indexGithubAPI() {

      var endpoint = config.github.api_path;
      var URL = 'https://api.github.com/' + endpoint;
      return fetch(URL).then(function (resp) { return resp.json(); }).then(function (resp) {
        _.each(resp, function (event) {
          event._actor = event.actor.login;

          client.create({
            index: config.index,
            type: 'event',
            id: event.id,
            body: event,
            timestamp: event.created_at
          }).catch(function (e) {});
        });
      });
    }
  }
});