const _ = require('lodash');
module.exports = (event) => {
  const labels = _.get(event, 'payload.issue.labels', []);
  if (labels.some((label) => label.name === 'P1')) return 1;
  if (labels.some((label) => label.name === 'P2')) return 0.5;
  return 0;
};
