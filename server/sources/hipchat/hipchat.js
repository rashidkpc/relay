const Source = require('../../lib/source.js');
const CronJob = require('cron').CronJob;
const config = require('../../lib/config');
const _ = require('lodash');
const Hipchatter = require('hipchatter');
const moment = require('moment');

module.exports = new Source('hipchat', {
  timestamp: 'date',
  id: 'id',
  actor: 'actor',
  start: function hipchat(server) {
    const hc = new Hipchatter(config.hipchat.apikey);
    const indexHipchat = () => {
      hc.history('kibana', (err, history) => {
        if (!history) return;
        _.each(history.items, entry => {
          if (_.isObject(entry.from)) {
            entry.actor = entry.from.mention_name;
          } else {
            return;
          }
          entry.id = entry.date + '_' + entry.actor;
          entry.date = moment(entry.date).format();
          this.store(entry);
        });
      });
    };

    new CronJob('*/30 * * * * *', function () {
      console.log('Every 30 seconds index hipchat');
      indexHipchat();
    }, null, true);
  }
});