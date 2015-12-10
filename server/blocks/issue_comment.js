var ImpactBlock = require('../lib/impact_block');

module.exports = new ImpactBlock ('Issue Comment', {
  fn: {
    filter: {
      bool: {
        must_not: [{
          exists: {
            field: 'payload.issue.pull_request.url'
          }
        }],
        must: [{
          term: {
            type: 'issuecommentevent',
          }
        }]
      }
    },
    weight: 0.5
  },
  color: '#01A4A4',
  toHTML: function (event) {
    return '<a target="_blank" href="' + event._source.payload.comment.html_url + '">' +
    event._source.repo.name + '#' +
    event._source.payload.issue.number + '</a>';
  }
});
