const Source = require('../../lib/source.js');
const CronJob = require('cron').CronJob;
const config = require('../../lib/config');
const fetch = require('node-fetch');
const loadMethods = require('../../lib/load_methods');
const _ = require('lodash');
const actors = loadMethods('../actors');

module.exports = new Source('discourse', {
  id: (event) => {
    return event.post_id || event.topic_id;
  },
  actor: 'username',
  timestamp: 'created_at',
  start: function discourse(server) {
    const indexDiscourse = () => {
      _.each(actors, actor => {
        const URL = config.discourse.url +
          '?api_key=' + config.discourse.api_key +
          '&api_username=' + config.discourse.api_username +
          '&username=' + actor.getAliasFor('discourse');

        return fetch(URL)
          .then(resp => resp.json())
          .then(resp => {
            if (!resp.user_actions) return;
            console.log('Discoursing:', actor.name);
            _.each(resp.user_actions, event => {
              if (event.username !== event.target_username) return;
              this.store(event);
            });
          })
          .catch(err => {
            console.log('Discourse failure');
            console.log(err.stack);
          });
      });
    };

    new CronJob('15 * * * * *', function () {
      indexDiscourse();
    }, null, true);
  }
});