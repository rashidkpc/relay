var _ = require('lodash');
module.exports = class Score {
  constructor(name, config) {
    this.name = name;
    this.fn = config.fn;
    this.color = config.color;
    this.toHTML = config.toHTML;
  }
};