const Actor = require('../lib/actor');

module.exports = new Actor('lukasolson', {
  aliases: {
    hipchat: 'Lukas',
    discourse: 'lukas'
  },
  sources: {
    github: {
      email: 'olson.lukas@gmail.com',
      repos: ['kibana', 'x-plugins']
    }
  }
});
