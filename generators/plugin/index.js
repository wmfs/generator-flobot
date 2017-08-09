'use strict'
const Generator = require('yeoman-generator')
const yosay = require('yosay')
const path = require('path')

// https://github.com/SBoudrias/mem-fs-editor
// http://ejs.co/
// https://github.com/SBoudrias/Inquirer.js

module.exports = class extends Generator {
  prompting () {
    this.log(yosay(
      'Welcome to FlobotJS plugin generator!'
    ))

    return this.prompt([
      {
        type: 'input',
        name: 'author',
        message: 'Please input the author\'s name'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Please add a description for this plugin:'
      },
      {
        type: 'confirm',
        name: 'hasServices',
        message: 'Does this plugin require services?'
      }]).then((answers) => (
      this.prompt(
        {
          type: 'input',
          name: 'services',
          message: 'Please list the services required (comma delimited):'
        }
      )
    )).then(
      function (props) {
        this.services = props.services

      }.bind(this))
  }

  writing () {
    const serviceArr = this.services.split(',')
    const serviceCont = {}
    let loc
    for (let service of serviceArr) {
      serviceCont.service = service.charAt(0).toUpperCase() + service.slice(1)
      loc = path.join('lib/components/services/', service)
      const fileName = loc + '.js'
      this.fs.copyTpl(path.resolve(__dirname, 'templates/_service_index.js'), fileName, serviceCont)
    }

    const dirname = __dirname
    console.log(this)
    const context = {
      author: this.author || 'Author',
      desc: this.description || 'Description',
      dir_name: dirname
    }
    this.fs.copyTpl(path.resolve(__dirname, 'templates/_package.json'), 'package.json', context)
    this.fs.copy(path.resolve(__dirname, './templates/dummyfile.txt'), 'lib/components/services/dummyfile.txt')
    this.fs.copy(path.resolve(__dirname, './templates/dummyfile.txt'), 'lib/components/states/dummyfile.txt')
    this.fs.copy(path.resolve(__dirname, './templates/_index.js'), 'lib/index.js')
    this.fs.copy(path.resolve(__dirname, './templates/_README.md'), 'README.md')
    this.fs.copy(path.resolve(__dirname, './templates/_gitignore'), '.gitignore')
    this.fs.copy(path.resolve(__dirname, './templates/_LICENSE.md'), 'LICENSE.md')
  }
}
