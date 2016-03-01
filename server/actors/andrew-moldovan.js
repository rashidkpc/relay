const Actor = require('../lib/actor');

module.exports = new Actor('andrew-moldovan', {
  aliases: {
    irc: 'andrew-moldovan'
  },
  sources: {
    github: {
      email: 'andras.moldovan@elastic.co',
      repos: ['kibana', 'x-plugins']
    }
  }
});
