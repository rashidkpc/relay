const Actor = require('../lib/actor');

module.exports = new Actor('LeeDr', {
  aliases: {
    hipchat: 'LeeD'
  },
  sources: {
    github: {
      email: 'lee.drengenberg@elastic.co'
    }
  }
});
