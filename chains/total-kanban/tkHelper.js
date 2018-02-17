const fs = require('fs')
const path = require('path')

module.exports = {
  getTemplate,
  getCardCckState
}

function getTemplate(template) {
  if (fs.existsSync(template)) {
    return fs.readFileSync(template, 'utf8')
  }
  return template
}

function getCardCckState(ins, vars, labelTypes) {
  let cckState = ins[0]
  let state = ins[1]
  let config = state.config
  let $ = vars.$
  for (let labelType of labelTypes) {
    let options = {}
    if (labelType.labels && $.util.isArray(labelType.labels)) {
      for (let label of labelType.labels) {
        options[label] = label
      }
    }
    cckState.fieldNames.push(labelType.name)
    cckState.schema.fields[labelType.name] = {
      options,
      caption: labelType.name,
      inputTemplate: getTemplate(config.cck.input.option),
      presentationTemplate: getTemplate(config.cck.presentation.option)
    }
  }
  return cckState
}