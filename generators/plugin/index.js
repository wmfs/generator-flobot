'use strict'

// Useful references:
//   - https://github.com/SBoudrias/mem-fs-editor
//   - http://ejs.co/
//   - https://github.com/SBoudrias/Inquirer.js

const Generator = require('yeoman-generator')
const yosay = require('yosay')
const path = require('path')

const Prompts = require('./../../utils/Prompts')
const makeTemplateContext = require('./../../utils/make-template-context')
const expandPluginName = require('./../../utils/expand-plugin-name')

module.exports = class extends Generator {
  prompting () {
    // Be welcoming!
    this.log(yosay(
      'Welcome to the FlobotJS PLUGIN generator!'
    ))

    // Make a new Prompts instance (makes building-up an array of prompts a bit simpler)
    const prompts = new Prompts()

    // Build-up our list of questions
    prompts.add({name: 'pluginName', message: 'Plugin name'})
    prompts.add({name: 'description', message: 'Description'})
    prompts.add({name: 'author', message: 'Author', default: this.config.get('author')})
    prompts.add({name: 'pluginsOutputDir', message: 'Plugins directory', default: this.config.get('pluginsOutputDir')})
    prompts.add({name: 'githubOwner', message: 'Github owner (user or org)', default: this.config.get('githubOwner')})
    prompts.add({name: 'githubMonorepo', message: 'Github monorepo name', default: this.config.get('githubMonorepo')})
    prompts.add({name: 'copyright', message: 'Copyright owner', default: this.config.get('copyright')})

    return this.prompt(prompts.prompts).then(
      function (promptingAnswers) {
        //
        // Done asking questions, set some things ahead of configuring.
        //
        promptingAnswers.pluginName = expandPluginName(promptingAnswers.pluginName)
        this.context = makeTemplateContext(promptingAnswers)
        this.destRoot = path.join(this.context.pluginsOutputDir, this.context.pluginName)
      }.bind(this))
  }

  configuring () {
    // Write the following to .yo-rc.json... used as defaults in subsequent generations
    this.config.set('pluginsOutputDir', this.context.pluginsOutputDir)
    this.config.set('author', this.context.author)
    this.config.set('githubOwner', this.context.githubOwner)
    this.config.set('githubMonorepo', this.context.githubMonorepo)
    this.config.set('copyright', this.context.copyright)
  }

  writing () {
    // And finally write-out templates/files
    const _this = this

    function templatePath (templateFilename) {
      return path.join(__dirname, 'templates', templateFilename)
    }

    function destPath (destPath) {
      return path.join(_this.destRoot, destPath)
    }

    this.fs.copyTpl(templatePath('package.json.ejs'), destPath('package.json'), this.context)
    this.fs.copyTpl(templatePath('index.js.ejs'), destPath('lib/index.js'), this.context)
    this.fs.copyTpl(templatePath('README.md.ejs'), destPath('README.md'), this.context)
    this.fs.copyTpl(templatePath('gitignore.ejs'), destPath('.gitignore'), this.context)
    this.fs.copyTpl(templatePath('LICENSE.ejs'), destPath('LICENSE'), this.context)
  }
}
