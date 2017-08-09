'use strict'

const chalk = require('chalk')

module.exports = function expandPluginName (originalPluginName) {

  let pluginName = originalPluginName

  if (pluginName.slice(0, 7) !== 'flobot-') {
    pluginName = 'flobot-' + pluginName
  }

  if (pluginName.slice(-7) !== '-plugin') {
    pluginName += '-plugin'
  }

  if (pluginName !== originalPluginName) {
    console.log('\nNote: plugin name has been expanded to ' + chalk.green(pluginName) + '\n')
  }

  return pluginName
}