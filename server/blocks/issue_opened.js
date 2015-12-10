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
  color: '#D0D102',
  toHTML: function (event) {
    return '<a target="_blank" href="' + event._source.payload.issue.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.issue.number + '</a>';
  }
});
