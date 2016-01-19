const Source = require('../../lib/source.js');
const CronJob = require('cron').CronJob;
const config = require('../../lib/config');
const fetch = require('node-fetch');
const _ = require('lodash');
const loadMethods = require('../../lib/load_methods');
const actors = loadMethods('../actors');
const actorsNames = actors.map((actor) => {
  return _.get(actor, 'aliases.github') || actor.name;
});

const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: config.elasticsearch.host,
});

module.exports = new Source('github', {
  timestamp: 'created_at',
  id: 'id',
  actor: 'actor.login',
  start: function github(server) {
    const getRepoEvents = (repo) => {
      console.log('Githubbing: ', repo);
      const credentials = config.github.credentials;

      const endpoint = 'repos/' + repo + '/events';
      const URL = 'https://' + credentials + '@api.github.com/' + endpoint;

      return fetch(URL)
        .then(resp => resp.json())
        .then(resp => _.each(resp, event => this.store(event)))
        .catch(err => {
          console.log('Github failure for:', repo);
          console.log(err);
        });
    };

    const indexGithubAPI = () => {
      _.each(actors, (actor) => {
        const repos = _.get(actor, 'sources.github.repos') || [];
        _.each(repos, (repo) => {
          getRepoEvents(actor.getAliasFor('github') + '/' + repo);
        });
      });

      _.each(config.github.other_repos, repo => getRepoEvents(repo));
    };

    new CronJob('45 * * * * *', function () {
      indexGithubAPI();
    }, null, true);
  }
});