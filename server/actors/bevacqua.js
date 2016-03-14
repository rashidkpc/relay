const Actor = require('../lib/actor');

module.exports = new Actor('bevacqua', {
  aliases: {
    hipchat: 'nico'
  },
  sources: {
    github: {
      email: 'hub@ponyfoo.com',
      repos: ['kibana', 'x-plugins']
    }
  }
});
