var ImpactBlock = require('../lib/impact_block');

module.exports = new ImpactBlock ('Issue Closed', {
  fn: {
    filter: {
      bool: {
        must: [
          {
            term: {
              type: 'issuesevent'
            }
          },
          {
            term: {
              'payload.action': 'closed'
            }
          }
        ],
        _name: 'lol'
      }
    },
    weight: 0.75
  },
  color: '#616161'
});
