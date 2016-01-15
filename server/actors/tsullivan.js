const Actor = require('../lib/actor');

module.exports = new Actor('tsullivan', {
  aliases: {
    hipchat: 'Tim'
  },
  sources: {
    github: {
      email: 'tsullivan@elastic.co'
    }
  }
});
