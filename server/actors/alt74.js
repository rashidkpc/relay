const Actor = require('../lib/actor');

module.exports = new Actor('alt74', {
  aliases: {
    hipchat: 'Jurgen'
  },
  sources: {
    github: {
      email: 'jurgen@elastic.co',
      repos: ['kibana']
    }
  }
});
