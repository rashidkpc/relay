var ImpactBlock = require('../lib/impact_block');

module.exports = new ImpactBlock ('Issue Opened', {
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
              'payload.action': 'opened'
            }
          }
        ]
      }
    },
    weight: 1
  },
  color: '#D0D102'
});
