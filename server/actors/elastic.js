const Actor = require('../lib/actor');

module.exports = new Actor('elastic', {
  aliases: {},
  sources: {
    github: {
      email: 'not.a.real.actor@not.a.real.actor',
      repos: ['kibana', 'x-plugins', 'timelion']
    }
  }
});
