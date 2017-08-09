'use strict'

const process = require('process')
const _ = require('lodash')

module.exports = function expectFlobotPluginsPath (generator) {
  // Expect $FLOBOT_PLUGINS_PATH to be set, fail if not
  generator.pluginsPath = process.env.FLOBOT_PLUGINS_PATH
  if (!_.isString(generator.pluginsPath)) {
    generator.env.error('You need to set the FLOBOT_PLUGINS_PATH environment variable!')
  }
}
