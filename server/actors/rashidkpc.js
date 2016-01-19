const Actor = require('../lib/actor');

module.exports = new Actor('rashidkpc', {
  aliases: {
    irc: 'rashidkpc',
    github: 'rashidkpc',
    hipchat: 'rashidkpc'
  },
  sources: {
    github: {
      email: 'github.fliplap@spamgourmet.com',
      repos: ['kibana', 'relay', 'timelion']
    }
  }
});