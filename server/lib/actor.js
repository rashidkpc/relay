var _ = require('lodash');
module.exports = class Actor {
  constructor(name, config) {
    this.name = name;
    this.sources = config.sources;
  }
};