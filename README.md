tewt
====

Template everything with TEWT

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/tewt.svg)](https://npmjs.org/package/tewt)
[![Downloads/week](https://img.shields.io/npm/dw/tewt.svg)](https://npmjs.org/package/tewt)
[![License](https://img.shields.io/npm/l/tewt.svg)](https://github.com/jjohnson1994/tewt/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g tewt
$ tewt COMMAND
running command...
$ tewt (-v|--version|version)
tewt/0.0.1 darwin-x64 node-v8.11.1
$ tewt --help [COMMAND]
USAGE
  $ tewt COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`tewt add`](#tewt-add)
* [`tewt help [COMMAND]`](#tewt-help-command)

## `tewt add`

Create a new file from a template.

```
USAGE
  $ tewt add [TEMPLATENAME] [FILENAME] [DESTINATIONDIRECTORY]

OPTIONS
  -n, --fileName=fileName          File Name
  -t, --templateName=templateName  Template Name
  
DESCRIPTION
  ...
tewt add
tewt add TemplateType
tewt add TemplateType NewFileName
tewt add -n NewFileName
```

_See code: [src/commands/add.js](https://github.com/jjohnson1994/tewt/blob/v0.0.0/src/commands/add.js)_

## `tewt help [COMMAND]`

display help for tewt

```
USAGE
  $ tewt help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_
<!-- commandsstop -->

# TEWT Config file

Template settings are stored in a file named 'tewt-rc.js' in yout project root. The example bellow defined two templates `page` and `component`
```
const tewtRc = {
  projectName: 'TEWT Test Project',
  templates: {
    page: {
      templatePath: 'templates/Page.vue',
      suggestedDirectory: 'app/pages',
      // Array of function, invoked after file creation
      hooks: [
        props => {
          // You can run a task here e.g. git commit...
        },
        props => {
          // ...or add tests
        },
      ],
    },
    component: {
      templatePath: 'templates/Component.vue',
      suggestedDirectory: 'app/components',
    },
  },
}

module.exports = tewtRc
```

# TEWT Template Files

Any file can be user as a template. TEWT also supports adding template variables to template files, the variabled will be auto populated when the template is used to generate a file.

Vue.js example:
```
<template>
  <div class="@NAME">
    <h1>Page Title</h1>
  </div>
</template>

<script>
export default {
  name: '@NAME',
}
</script>
``` 

React Example:
```
class @NAME extends React.Component {
  render(){
    return <h1>@NAME</h1>;
  }
}
```


