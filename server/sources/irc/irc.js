const Source = require('../../lib/source.js');
const config = require('../../lib/config');
const _ = require('lodash');
const irc = require('irc');

module.exports = new Source('irc', {
  id: 'id',
  actor: 'from',
  timestamp: '@timestamp',
  start: function github(server) {
    const client = new irc.Client('chat.freenode.net', 'relaytable', {
      channels: config.irc.channels,
    });

    client.addListener('message', (from, to, message) => {
      const now = new Date();
      this.store({
        '@timestamp': now.toISOString(),
        id: now.getTime() + '_' + from,
        to: to,
        from: from,
        message: message
      });
    });

    client.addListener('error', message => {
      console.log('error: ', message);
    });
  }
});