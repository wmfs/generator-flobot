'use strict'

// Useful references:
//   - https://github.com/SBoudrias/mem-fs-editor
//   - http://ejs.co/
//   - https://github.com/SBoudrias/Inquirer.js

const Generator = require('yeoman-generator')
const yosay = require('yosay')
const path = require('path')
const _ = require('lodash')

const Prompts = require('./../../utils/Prompts')
const makeTemplateContext = require('./../../utils/make-template-context')

module.exports = class extends Generator {
  prompting () {
    // Be welcoming!
    this.log(yosay(
      'Welcome to the FlobotJS SERVICE generator!'
    ))

    // Make a new Prompts instance (makes building-up an array of prompts a bit simpler)
    const prompts = new Prompts()

    // Build-up our list of questions
    prompts.addPluginPath(this)
    prompts.add({name: 'serviceName', message: 'Service name (camelCase)'})
    prompts.add({name: 'description', message: 'Description'})
    prompts.add({
      name: 'configurable',
      message: 'Does service refer to boot configuration?',
      type: 'confirm',
      default: false
    })
    prompts.add({
      name: 'confirmBlueprintDirs',
      message: 'Does service read blueprint content?',
      type: 'confirm',
      default: false
    })

    prompts.add({
      name: 'blueprintDirs',
      message: 'Which blueprint dirs are read? (comma delimited)',
      when: function (answers) { return answers.confirmBlueprintDirs }
    })

    return this.prompt(prompts.prompts).then(
      function (promptingAnswers) {
        //
        // Done asking questions, set some things ahead of configuring.
        //
        this.context = makeTemplateContext(promptingAnswers)
        this.destRoot = path.join(this.context.pluginPath, 'lib/components/services', _.kebabCase(this.context.serviceName))

        this.context.className = _.upperFirst(this.context.serviceName) + 'Service'
        this.context.pluginName = path.basename(this.context.pluginPath)

        if (this.context.confirmBlueprintDirs && _.isString(this.context.blueprintDirs) && this.context.blueprintDirs !== '') {
          const processedDirs = []
          this.context.blueprintDirs.split(',').forEach(
            function (blueprintDirName) {
              processedDirs.push(_.kebabCase(blueprintDirName))
            }
          )
          this.context.blueprintDirs = processedDirs
        }
      }.bind(this))
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

    this.fs.copyTpl(templatePath('service-index.js.ejs'), destPath('index.js'), this.context)
    this.fs.copyTpl(templatePath('schema.json.ejs'), destPath('schema.json'), this.context)
    this.fs.copyTpl(templatePath('doc-index.js.ejs'), destPath('doc/index.js'), this.context)

    if (this.context.configurable) {
      this.fs.copyTpl(templatePath('example.json.ejs'), destPath('doc/example.json'), this.context)
    }
  }
}
