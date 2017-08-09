'use strict'

module.exports = function trimPluginName (fullPluginName) {

  let pluginName = fullPluginName

  if (pluginName.slice(0, 7) === 'flobot-') {
    pluginName = pluginName.slice(7)
  }

  if (pluginName.slice(-7) === '-plugin') {
    pluginName = pluginName.slice(0, -7)
  }

  return pluginName
}