const Actor = require('../lib/actor');

module.exports = new Actor('lukasolson', {
  aliases: {
    hipchat: 'Lukas'
  },
  sources: {
    github: {
      email: 'olson.lukas@gmail.com'
    }
  }
});
