const Actor = require('../lib/actor');

module.exports = new Actor('epixa', {
  aliases: {
    hipchat: 'Court',
    irc: 'court'
  },
  sources: {
    github: {
      email: 'court@epixa.com',
      repos: ['kibana', 'x-plugins']
    }
  }
});
