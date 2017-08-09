'use strict'

const _ = require('lodash')

module.exports = class Prompts {
  constructor () {
    this.prompts = []
  }

  add (options) {
    const newPrompt = {
      type: options.type || 'input',
      name: options.name,
      message: options.message
    }

    if (options.hasOwnProperty('default') && !_.isUndefined(options.default) && !_.isNull(options.default)) {
      newPrompt.default = options.default
    }

    if (options.hasOwnProperty('choices')) {
      newPrompt.choices = options.choices
    }

    this.prompts.push(newPrompt)
  }
}
