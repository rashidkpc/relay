var ImpactBlock = require('../lib/impact_block');

module.exports = new ImpactBlock ('Pull Comment', {
  fn: {
    filter: {
      bool: {
        should: [
          {
            term: {
              type: 'pullrequestreviewcommentevent'
            }
          },
          {
            exists: {
              field: 'payload.issue.pull_request.url'
            }
          }
        ]
      }
    },
    weight: 1.8
  },
  importance: 10,
  color: '#c66',
  toHTML: function (event) {
    return '<a target="_blank" href="' + event._source.payload.comment.html_url + '">' +
    event._source.repo.name + '#' +
    (event._source.payload.pull_request || event._source.payload.issue).number + '</a>';
  }
});
