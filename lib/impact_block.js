var _ = require('lodash');
module.exports = class ImpactBlock {
  constructor(name, config) {
    this.name = name;
    this.fn = config.fn;
    this.color = config.color;
  }
};