const Actor = require('../lib/actor');

module.exports = new Actor('tylersmalley', {
  aliases: {
    irc: 'tsmalley'
  },
  sources: {
    github: {
      email: 'tyler.smalley@elastic.co',
      repos: ['kibana', 'x-plugins']
    }
  }
});
