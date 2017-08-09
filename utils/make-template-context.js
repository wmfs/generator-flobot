'use strict'

const _ = require('lodash')

module.exports = function makeTemplateContext (promptingAnswers) {
  const ctx = _.cloneDeep(promptingAnswers)
  ctx.year = new Date().getFullYear()

  if (promptingAnswers.hasOwnProperty('githubMonorepo')) {
    ctx.githubRepo = promptingAnswers.githubMonorepo
  } else {
    if (promptingAnswers.hasOwnProperty('pluginName')) {
      ctx.githubRepo = promptingAnswers.pluginName
    }
  }

  console.log('')
  console.log('  Values')
  console.log('  ------')

  _.forEach(
    ctx,
    function (value, key) {
      console.log(`  ${key}: ${value}`)
    }
  )
  console.log('')
  return ctx
}
