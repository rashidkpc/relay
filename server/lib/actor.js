var _ = require('lodash');
module.exports = class Actor {
  constructor(name, config) {
    this.name = name;
    this.aliases = config.aliases;
    this.sources = config.sources;

    this.getAliasFor = source => {
      return this.aliases[source] || this.name;
    };
  }
};