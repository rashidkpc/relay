const Actor = require('../lib/actor');

module.exports = new Actor('bradwestfall', {
  aliases: {
    irc: 'bradwestfall',
    discourse: 'bradwestfall'
  },
  sources: {
    github: {
      email: 'brad@azpixels.com',
      repos: ['kibana']
    }
  }
});
