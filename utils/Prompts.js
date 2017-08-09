'use strict'

const _ = require('lodash')
const expectFlobotPluginsPath = require('./expect-flobot-plugins-path')
const trimPluginName = require('./trim-plugin-name')
const pathExploder = require('./path-exploder')
const path = require('path')

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

    if (options.hasOwnProperty('when')) {
      newPrompt.when = options.when
    }

    this.prompts.push(newPrompt)
  }

  addPluginPath (generator) {
    expectFlobotPluginsPath(generator)
    const pluginPaths = pathExploder(generator.pluginsPath, {expectModule: false})
    let choices = []

    pluginPaths.forEach(
      function (pluginPath) {
        choices.push(
          {
            value: pluginPath,
            name: trimPluginName(path.basename(pluginPath)),
            short: pluginPath
          }
        )
      }
    )

    choices = _.sortBy(choices, 'name')

    this.add(
      {
        type: 'list',
        name: 'pluginPath',
        message: 'Plugin',
        choices: choices
      }
    )
  }
}
