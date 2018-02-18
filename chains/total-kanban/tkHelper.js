const fs = require('fs')
const path = require('path')
const {markdown} = require('markdown')

module.exports = {
  getTemplate,
  getCardCckState,
  getCardCckStateWithParsedDescription
}

function getTemplate(template) {
  if (fs.existsSync(template)) {
    return fs.readFileSync(template, 'utf8')
  }
  return template
}

function getCardCckStateWithParsedDescription (cckState) {
  if (cckState.result.result) {
    cckState.result.result.parsedDescription = markdown.toHTML(cckState.result.result.description)
  } else if (cckState.result.results) {
    for (let i = 0; i < cckState.result.results.length; i++) {
      cckState.result.results[i].parsedDescription = markdown.toHTML(cckState.result.results[i].description)
    }
  }
  return cckState
}

function getCardCckState(ins, vars, labelTypes) {
  let cckState = ins[0]
  let state = ins[1]
  let config = state.config
  let $ = vars.$
  for (let labelType of labelTypes) {
    let options = {}
    if (labelType.labels && $.util.isArray(labelType.labels)) {
      options[''] = '[Not Set]'
      for (let label of labelType.labels) {
        options[label] = label
      }
    }
    cckState.fieldNames.push(labelType.name)
    cckState.schema.fields[labelType.name] = {
      options,
      caption: labelType.caption,
      inputTemplate: getTemplate(config.cck.input.option),
      presentationTemplate: getTemplate(config.cck.presentation.option),
      hidden: ['tabular']
    }
  }
  return cckState
}