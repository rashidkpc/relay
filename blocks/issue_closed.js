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
  color: '#616161',
  toHTML: function (event) {
    return '<a target="_blank" href="' + event._source.payload.issue.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.issue.number + '</a>';
  }
});
