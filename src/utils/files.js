const fs = require('fs')
const path = require('path')

/**
 * Return the content of a file as a string
 * @returns {string} file content
 */
function read(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

/**
 * Swap @VARS placeholders in files for values
 * @returns {string} updated file content
 */
function update(fileContent, templateVars) {
  let updatedFileContent = fileContent

  templateVars.forEach(([key, value]) => {
    const regExp = new RegExp(`${key}`, 'g')
    updatedFileContent = updatedFileContent.replace(regExp, value)
  })

  return updatedFileContent
}

function makeDir(dir) {
  fs.mkdirSync(dir, {recursive: true})
}

function getFileExtension(filePath) {
  return path.extname(filePath)
}

function duplicate(existingFilePath, newFilePath, newFileName, templateVars) {
  return new Promise(async (resolve, reject) => {
    makeDir(newFilePath)

    const rawContent = read(existingFilePath)
    if (!rawContent) {
      return
    }

    const updatedFileContent = update(rawContent, templateVars)
    if (!updatedFileContent) {
      return
    }

    const fileExtension = getFileExtension(existingFilePath)
    fs.writeFile(`${newFilePath}/${newFileName}${fileExtension}`, updatedFileContent, err => {
      if (err) {
        return reject(err)
      }

      return resolve()
    })
  })
}

module.exports = {
  duplicate,
}
