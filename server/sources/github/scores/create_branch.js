const Score = require('../../../lib/score');
const _ = require('lodash');
const scorePerBranch = 0.25;

module.exports = new Score ('create_branch', {
  fn: (event, actor) => {
    const type = _.get(event, 'payload.ref_type');
    if (type === 'branch') {
      return scorePerBranch;
    }
  },
  color: '#50A162',
  toHTML: (event, actor) => {
    const repoName = _.get(event._source, 'repo.name');
    const branch = _.get(event._source, 'payload.ref');
    return `Created branch <a href="https://github.com/${repoName}/tree/${branch}">${repoName}#${branch}</a>`;
  }
});

