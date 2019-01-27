const {Command, flags} = require('@oclif/command')
const inquirer = require('inquirer')
const Listr = require('listr')
const files = require('../utils/files.js')
const tewtRc = require('../../tewt-rc.js')

const templateTypes = () => Object.keys(tewtRc.templates)

const promptForTemplateType = () => new Promise(async resolve => {
  const {templateType} = await inquirer.prompt({
    type: 'list',
    name: 'templateType',
    message: 'Create File From Template:',
    choices: templateTypes(),
  })

  resolve(templateType)
})

const promptForNewFileName = () => new Promise(async resolve => {
  const {fileName} = await inquirer.prompt({
    name: 'fileName',
    message: 'New File Name:',
  })

  resolve(fileName)
})

class CreateCommand extends Command {
  // Merge arguments and flags into one object
  getCommandArguments() {
    const {args, flags} = this.parse(CreateCommand)
    const userArgs = {
      fileName: args.fileName || flags.fileName,
      templateName: args.templateName || flags.templateName,
      destinationDirectory: args.destinationDirectory || flags.destinationDirectory,
    }

    return userArgs
  }

  async run() {
    // Get input for template type and new file name
    let {templateName, fileName, destinationDirectory} = this.getCommandArguments()
    if (!templateName) {
      templateName = await promptForTemplateType()
    }

    if (!fileName) {
      fileName = await promptForNewFileName()
    }

    // Get Template Properties
    const templateProps = tewtRc.templates[templateName]
    const {
      templatePath, suggestedDirectory, hooks,
    } = templateProps

    // Confirm directory is non was given in args
    let confirmedPath = destinationDirectory
    if (!confirmedPath) {
      ({confirmedPath} = await inquirer.prompt([
        {
          name: 'confirmedPath',
          message: 'Confirm File Directory:',
          default: suggestedDirectory,
        },
      ]))
    }

    // Confirm name if only specified in args
    let confirmedName = fileName
    if (flags.fileName) {
      ({confirmedName} = await inquirer.prompt([
        {
          name: 'confirmedName',
          message: 'Confirm File Name:',
          default: fileName,
        },
      ]))
    }

    // Create File
    const templateVars = [
      ['@NAME', confirmedName],
    ]
    const tasks = new Listr([
      {
        title: 'Creating New File',
        task: () => {
          files.duplicate(templatePath, confirmedPath, confirmedName, templateVars)
        },
      },
      {
        title: 'Running Hooks',
        enabled: () => Array.isArray(hooks),
        task: () => {
          hooks.forEach(hook => hook(templateProps))
        },
      },
    ])

    tasks.run().catch(error => this.error(error))
  }
}

CreateCommand.strict = false

CreateCommand.description = `Create a file from a template
...
tewt add
tewt add TemplateType
tewt add TemplateType NewFileName
tewt add -n NewFileName
`

CreateCommand.flags = {
  templateName: flags.string({char: 't', description: 'Template Name'}),
  fileName: flags.string({char: 'n', description: 'File Name'}),
}

CreateCommand.args = [
  {name: 'templateName'},
  {name: 'fileName'},
  {name: 'destinationDirectory'},
]

module.exports = CreateCommand
