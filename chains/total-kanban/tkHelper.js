const fs = require('fs')
const path = require('path')
const {markdown} = require('markdown')

module.exports = {
  getTemplate,
  initLabeledCardCckState,
  embedCardVirtualFields
}

function getTemplate(template) {
  if (fs.existsSync(template)) {
    return fs.readFileSync(template, 'utf8')
  }
  return template
}

function getCardRowWithParsedDescription (row) {
  row.parsedDescription = markdown.toHTML(row.description)
  return row
}

function getCardRowWithTags (row) {
  row.tags = {}
  const nonTagFieldNames = ['_id', '_muser', '_mtime', '_deleted', '_history', 'name', 'description', 'scheduleFrom', 'scheduleTo', 'members', 'progressMeter', 'attachments', 'board', 'default', 'parsedDescription', 'tags']
  for (let fieldName in row) {
    if (nonTagFieldNames.indexOf(fieldName) >= 0) { continue }
    row.tags[fieldName] = row[fieldName]
  }
  return row
}

function getCardRowWithAdditionalFields (row) {
  row = getCardRowWithParsedDescription(row)
  row = getCardRowWithTags(row)
  return row
}

function embedCardVirtualFields (cckState) {
  if (cckState.result.result) {
    cckState.result.result = getCardRowWithAdditionalFields(cckState.result.result)
  } else if (cckState.result.results) {
    for (let i = 0; i < cckState.result.results.length; i++) {
      cckState.result.results[i] = getCardRowWithAdditionalFields(cckState.result.results[i])
    }
  }
  return cckState
}

function initLabeledCardCckState (ins, vars, labelTypes) {
  let cckState = ins[0]
  let state = ins[1]
  let config = state.config
  let $ = vars.$
  for (let labelType of labelTypes) {
    // don't add the same label twice
    if (cckState.fieldNames.indexOf(labelType.name) >= 0) { continue }
    // build options
    let options = {}
    if (labelType.labels && $.util.isArray(labelType.labels)) {
      options[''] = '[Not Set]'
      for (let label of labelType.labels) {
        options[label] = label
      }
    }
    // add label metadata to cckState
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