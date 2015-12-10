var _ = require('lodash');
module.exports = class ImpactBlock {
  constructor(name, config) {
    this.name = name;
    this.fn = config.fn;
    this.importance = config.importance;
    this.color = config.color;
    this.toHTML = config.toHTML;
  }
};