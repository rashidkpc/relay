var _ = require('lodash');
module.exports = class Source {
  constructor(name, config) {
    this.name = name;
    this.start = config.start;
  }
};