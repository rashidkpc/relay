const Source = require('../../lib/source.js');
const CronJob = require('cron').CronJob;
const config = require('../../lib/config');
const fetch = require('node-fetch');
const _ = require('lodash');

const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: config.elasticsearch.host,
});

module.exports = new Source('github', {
  timestamp: 'created_at',
  id: 'id',
  actor: 'actor.login',
  start: function github(server) {
    const indexGithubAPI = () => {
      const endpoint = config.github.api_path;
      const credentials = config.github.credentials;
      const URL = 'https://' + credentials + '@api.github.com/' + endpoint;
      return fetch(URL)
        .then(resp => resp.json())
        .then(resp => _.each(resp, event => this.store(event)));
    };

    new CronJob('5 */1 * * * *', function () {
      console.log('Every 1 minutes index github api');
      indexGithubAPI();
    }, null, true);
  }
});