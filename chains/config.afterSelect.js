const fs = require('fs')
const path = require('path')

function getTemplate (template) {
  if (fs.existsSync(template)) {
    return fs.readFileSync(template, 'utf8')
  }
  return template
}

function restrictDelete(row) {
  if (row.defaultConfig) {
    row._restrictDelete = true
  }
  return row
}

module.exports = (ins, vars, callback) => {
  let cckState = ins[0]
  let state = ins[1]
  let config = state.config

  // prepare
  try {
    if ('results' in cckState.result) {
      for (let i=0; i<cckState.result.results.length; i++) {
        cckState.result.results[i] = restrictDelete(cckState.result.results[i])
      }
    } else if ('result' in cckState.result) {
      let key = cckState.result.result.key

      cckState.result.result = restrictDelete(cckState.result.result)

      if (cckState.result.result.defaultConfig) {
        cckState.schema.fields.key.inputTemplate = '<%= value %><input name="key" value="<%= value %>" type="hidden" />'
      }

      // navigation
      if (['navigation'].indexOf(key) > -1) {
        cckState.schema.fields.value.inputTemplate = getTemplate(config.cck.input.one2many)
        cckState.schema.fields.value.presentationTemplate = getTemplate(config.cck.presentation.one2many)
        cckState.schema.fields.value.fields = {
          caption: {
            caption: 'Caption',
            inputTemplate: getTemplate(config.cck.input.text),
            presentationTemplate: getTemplate(config.cck.presentation.text),
            bootstrapColWidth: 2
          },
          url: {
            caption: 'URL',
            inputTemplate: getTemplate(config.cck.input.text),
            presentationTemplate: getTemplate(config.cck.presentation.text),
            bootstrapColWidth: 2
          },
          groups: {
            caption: 'Groups',
            inputTemplate: getTemplate(config.cck.input.jsonText),
            presentationTemplate: getTemplate(config.cck.presentation.list),
            bootstrapColWidth: 2
          },
          children: {
            caption: 'Children',
            inputTemplate: getTemplate(config.cck.input.one2many),
            presentationTemplate: getTemplate(config.cck.presentation.one2many),
            fields: {
              caption: {
                caption: 'Caption',
                inputTemplate: getTemplate(config.cck.input.text),
                presentationTemplate: getTemplate(config.cck.presentation.text)
              },
              url: {
                caption: 'URL',
                inputTemplate: getTemplate(config.cck.input.text),
                presentationTemplate: getTemplate(config.cck.presentation.text)
              },
              groups: {
                caption: 'Groups',
                inputTemplate: getTemplate(config.cck.input.jsonText),
                presentationTemplate: getTemplate(config.cck.presentation.list)
              }
            }
          }
        }
      }

      // images
      if (['logo'].indexOf(key) > -1) {
        cckState.schema.fields.value.inputTemplate = getTemplate(config.cck.input.image)
      }

      // booleans
      if (['showLeftNav', 'showTopNav', 'showJumbotron', 'showRightWidget', 'showFooter'].indexOf(key) > -1) {
        cckState.schema.fields.value.inputTemplate = getTemplate(config.cck.input.option)
        cckState.schema.fields.value.options = ['No', 'Yes']
      }

      // verbose
      if (['verbose'].indexOf(key) > -1) {
        cckState.schema.fields.value.inputTemplate = getTemplate(config.cck.input.option)
        cckState.schema.fields.value.options = ['Not Verbose', 'Verbose', 'Very Verbose']
      }

      // bootstrapTheme
      if (['bootstrapTheme'].indexOf(key) > -1) {
        cckState.schema.fields.value.inputTemplate = getTemplate(config.cck.input.option)
        cckState.schema.fields.value.options = {'': '[No Theme]'}
        fs.readdirSync(path.join(config.staticPath, 'css/themes')).forEach((fileName) => {
          if (fileName.substr(fileName.length - 8, 8) === '.min.css') {
            let key = fileName.substr(0, fileName.length - 8)
            cckState.schema.fields.value.options[key] = key[0].toUpperCase() + key.slice(1)
          }
        })
      }

      // bootstrapNavClass
      if (['bootstrapNavClass'].indexOf(key) > -1) {
        cckState.schema.fields.value.inputTemplate = getTemplate(config.cck.input.option)
        cckState.schema.fields.value.options = {
          'navbar-light bg-light': 'navbar-light, bg-light',
          'navbar-light bg-light fixed-top': 'navbar-light, bg-light, fixed-top',
          'navbar-light bg-light fixed-bottom': 'navbar-light, bg-light, fixed-bottom',
          'navbar-light bg-light static-top': 'navbar-light, bg-light, static-top',
          'navbar-light navbar-expand-sm bg-light': 'navbar-light, expand-sm, bg-light, default',
          'navbar-light navbar-expand-sm bg-light fixed-top': 'navbar-light, expand-sm, bg-light, fixed-top',
          'navbar-light navbar-expand-sm bg-light fixed-bottom': 'navbar-light, expand-sm, bg-light, fixed-bottom',
          'navbar-light navbar-expand-sm bg-light static-top': 'navbar-light, expand-sm, bg-light, static-top',
          'navbar-light navbar-expand-md bg-light': 'navbar-light, expand-md, bg-light, default',
          'navbar-light navbar-expand-md bg-light fixed-top': 'navbar-light, expand-md, bg-light, fixed-top',
          'navbar-light navbar-expand-md bg-light fixed-bottom': 'navbar-light, expand-md, bg-light, fixed-bottom',
          'navbar-light navbar-expand-md bg-light static-top': 'navbar-light, expand-md, bg-light, static-top',
          'navbar-light navbar-expand-lg bg-light': 'navbar-light, expand-lg, bg-light, default',
          'navbar-light navbar-expand-lg bg-light fixed-top': 'navbar-light, expand-lg, bg-light, fixed-top',
          'navbar-light navbar-expand-lg bg-light fixed-bottom': 'navbar-light, expand-lg, bg-light, fixed-bottom',
          'navbar-light navbar-expand-lg bg-light static-top': 'navbar-light, expand-lg, bg-light, static-top',
          'navbar-light navbar-expand-xl bg-light': 'navbar-light, expand-xl, bg-light, default',
          'navbar-light navbar-expand-xl bg-light fixed-top': 'navbar-light, expand-xl, bg-light, fixed-top',
          'navbar-light navbar-expand-xl bg-light fixed-bottom': 'navbar-light, expand-xl, bg-light, fixed-bottom',
          'navbar-light navbar-expand-xl bg-light static-top': 'navbar-light, expand-xl, bg-light, static-top',
          'navbar-light bg-dark': 'navbar-light, bg-dark',
          'navbar-light bg-dark fixed-top': 'navbar-light, bg-dark, fixed-top',
          'navbar-light bg-dark fixed-bottom': 'navbar-light, bg-dark, fixed-bottom',
          'navbar-light bg-dark static-top': 'navbar-light, bg-dark, static-top',
          'navbar-light navbar-expand-sm bg-dark': 'navbar-light, expand-sm, bg-dark, default',
          'navbar-light navbar-expand-sm bg-dark fixed-top': 'navbar-light, expand-sm, bg-dark, fixed-top',
          'navbar-light navbar-expand-sm bg-dark fixed-bottom': 'navbar-light, expand-sm, bg-dark, fixed-bottom',
          'navbar-light navbar-expand-sm bg-dark static-top': 'navbar-light, expand-sm, bg-dark, static-top',
          'navbar-light navbar-expand-md bg-dark': 'navbar-light, expand-md, bg-dark, default',
          'navbar-light navbar-expand-md bg-dark fixed-top': 'navbar-light, expand-md, bg-dark, fixed-top',
          'navbar-light navbar-expand-md bg-dark fixed-bottom': 'navbar-light, expand-md, bg-dark, fixed-bottom',
          'navbar-light navbar-expand-md bg-dark static-top': 'navbar-light, expand-md, bg-dark, static-top',
          'navbar-light navbar-expand-lg bg-dark': 'navbar-light, expand-lg, bg-dark, default',
          'navbar-light navbar-expand-lg bg-dark fixed-top': 'navbar-light, expand-lg, bg-dark, fixed-top',
          'navbar-light navbar-expand-lg bg-dark fixed-bottom': 'navbar-light, expand-lg, bg-dark, fixed-bottom',
          'navbar-light navbar-expand-lg bg-dark static-top': 'navbar-light, expand-lg, bg-dark, static-top',
          'navbar-light navbar-expand-xl bg-dark': 'navbar-light, expand-xl, bg-dark, default',
          'navbar-light navbar-expand-xl bg-dark fixed-top': 'navbar-light, expand-xl, bg-dark, fixed-top',
          'navbar-light navbar-expand-xl bg-dark fixed-bottom': 'navbar-light, expand-xl, bg-dark, fixed-bottom',
          'navbar-light navbar-expand-xl bg-dark static-top': 'navbar-light, expand-xl, bg-dark, static-top',
          'navbar-light bg-primary': 'navbar-light, bg-primary',
          'navbar-light bg-primary fixed-top': 'navbar-light, bg-primary, fixed-top',
          'navbar-light bg-primary fixed-bottom': 'navbar-light, bg-primary, fixed-bottom',
          'navbar-light bg-primary static-top': 'navbar-light, bg-primary, static-top',
          'navbar-light navbar-expand-sm bg-primary': 'navbar-light, expand-sm, bg-primary, default',
          'navbar-light navbar-expand-sm bg-primary fixed-top': 'navbar-light, expand-sm, bg-primary, fixed-top',
          'navbar-light navbar-expand-sm bg-primary fixed-bottom': 'navbar-light, expand-sm, bg-primary, fixed-bottom',
          'navbar-light navbar-expand-sm bg-primary static-top': 'navbar-light, expand-sm, bg-primary, static-top',
          'navbar-light navbar-expand-md bg-primary': 'navbar-light, expand-md, bg-primary, default',
          'navbar-light navbar-expand-md bg-primary fixed-top': 'navbar-light, expand-md, bg-primary, fixed-top',
          'navbar-light navbar-expand-md bg-primary fixed-bottom': 'navbar-light, expand-md, bg-primary, fixed-bottom',
          'navbar-light navbar-expand-md bg-primary static-top': 'navbar-light, expand-md, bg-primary, static-top',
          'navbar-light navbar-expand-lg bg-primary': 'navbar-light, expand-lg, bg-primary, default',
          'navbar-light navbar-expand-lg bg-primary fixed-top': 'navbar-light, expand-lg, bg-primary, fixed-top',
          'navbar-light navbar-expand-lg bg-primary fixed-bottom': 'navbar-light, expand-lg, bg-primary, fixed-bottom',
          'navbar-light navbar-expand-lg bg-primary static-top': 'navbar-light, expand-lg, bg-primary, static-top',
          'navbar-light navbar-expand-xl bg-primary': 'navbar-light, expand-xl, bg-primary, default',
          'navbar-light navbar-expand-xl bg-primary fixed-top': 'navbar-light, expand-xl, bg-primary, fixed-top',
          'navbar-light navbar-expand-xl bg-primary fixed-bottom': 'navbar-light, expand-xl, bg-primary, fixed-bottom',
          'navbar-light navbar-expand-xl bg-primary static-top': 'navbar-light, expand-xl, bg-primary, static-top',
          'navbar-dark bg-light': 'navbar-dark, bg-light',
          'navbar-dark bg-light fixed-top': 'navbar-dark, bg-light, fixed-top',
          'navbar-dark bg-light fixed-bottom': 'navbar-dark, bg-light, fixed-bottom',
          'navbar-dark bg-light static-top': 'navbar-dark, bg-light, static-top',
          'navbar-dark navbar-expand-sm bg-light': 'navbar-dark, expand-sm, bg-light, default',
          'navbar-dark navbar-expand-sm bg-light fixed-top': 'navbar-dark, expand-sm, bg-light, fixed-top',
          'navbar-dark navbar-expand-sm bg-light fixed-bottom': 'navbar-dark, expand-sm, bg-light, fixed-bottom',
          'navbar-dark navbar-expand-sm bg-light static-top': 'navbar-dark, expand-sm, bg-light, static-top',
          'navbar-dark navbar-expand-md bg-light': 'navbar-dark, expand-md, bg-light, default',
          'navbar-dark navbar-expand-md bg-light fixed-top': 'navbar-dark, expand-md, bg-light, fixed-top',
          'navbar-dark navbar-expand-md bg-light fixed-bottom': 'navbar-dark, expand-md, bg-light, fixed-bottom',
          'navbar-dark navbar-expand-md bg-light static-top': 'navbar-dark, expand-md, bg-light, static-top',
          'navbar-dark navbar-expand-lg bg-light': 'navbar-dark, expand-lg, bg-light, default',
          'navbar-dark navbar-expand-lg bg-light fixed-top': 'navbar-dark, expand-lg, bg-light, fixed-top',
          'navbar-dark navbar-expand-lg bg-light fixed-bottom': 'navbar-dark, expand-lg, bg-light, fixed-bottom',
          'navbar-dark navbar-expand-lg bg-light static-top': 'navbar-dark, expand-lg, bg-light, static-top',
          'navbar-dark navbar-expand-xl bg-light': 'navbar-dark, expand-xl, bg-light, default',
          'navbar-dark navbar-expand-xl bg-light fixed-top': 'navbar-dark, expand-xl, bg-light, fixed-top',
          'navbar-dark navbar-expand-xl bg-light fixed-bottom': 'navbar-dark, expand-xl, bg-light, fixed-bottom',
          'navbar-dark navbar-expand-xl bg-light static-top': 'navbar-dark, expand-xl, bg-light, static-top',
          'navbar-dark bg-dark': 'navbar-dark, bg-dark',
          'navbar-dark bg-dark fixed-top': 'navbar-dark, bg-dark, fixed-top',
          'navbar-dark bg-dark fixed-bottom': 'navbar-dark, bg-dark, fixed-bottom',
          'navbar-dark bg-dark static-top': 'navbar-dark, bg-dark, static-top',
          'navbar-dark navbar-expand-sm bg-dark': 'navbar-dark, expand-sm, bg-dark, default',
          'navbar-dark navbar-expand-sm bg-dark fixed-top': 'navbar-dark, expand-sm, bg-dark, fixed-top',
          'navbar-dark navbar-expand-sm bg-dark fixed-bottom': 'navbar-dark, expand-sm, bg-dark, fixed-bottom',
          'navbar-dark navbar-expand-sm bg-dark static-top': 'navbar-dark, expand-sm, bg-dark, static-top',
          'navbar-dark navbar-expand-md bg-dark': 'navbar-dark, expand-md, bg-dark, default',
          'navbar-dark navbar-expand-md bg-dark fixed-top': 'navbar-dark, expand-md, bg-dark, fixed-top',
          'navbar-dark navbar-expand-md bg-dark fixed-bottom': 'navbar-dark, expand-md, bg-dark, fixed-bottom',
          'navbar-dark navbar-expand-md bg-dark static-top': 'navbar-dark, expand-md, bg-dark, static-top',
          'navbar-dark navbar-expand-lg bg-dark': 'navbar-dark, expand-lg, bg-dark, default',
          'navbar-dark navbar-expand-lg bg-dark fixed-top': 'navbar-dark, expand-lg, bg-dark, fixed-top',
          'navbar-dark navbar-expand-lg bg-dark fixed-bottom': 'navbar-dark, expand-lg, bg-dark, fixed-bottom',
          'navbar-dark navbar-expand-lg bg-dark static-top': 'navbar-dark, expand-lg, bg-dark, static-top',
          'navbar-dark navbar-expand-xl bg-dark': 'navbar-dark, expand-xl, bg-dark, default',
          'navbar-dark navbar-expand-xl bg-dark fixed-top': 'navbar-dark, expand-xl, bg-dark, fixed-top',
          'navbar-dark navbar-expand-xl bg-dark fixed-bottom': 'navbar-dark, expand-xl, bg-dark, fixed-bottom',
          'navbar-dark navbar-expand-xl bg-dark static-top': 'navbar-dark, expand-xl, bg-dark, static-top',
          'navbar-dark bg-primary': 'navbar-dark, bg-primary',
          'navbar-dark bg-primary fixed-top': 'navbar-dark, bg-primary, fixed-top',
          'navbar-dark bg-primary fixed-bottom': 'navbar-dark, bg-primary, fixed-bottom',
          'navbar-dark bg-primary static-top': 'navbar-dark, bg-primary, static-top',
          'navbar-dark navbar-expand-sm bg-primary': 'navbar-dark, expand-sm, bg-primary, default',
          'navbar-dark navbar-expand-sm bg-primary fixed-top': 'navbar-dark, expand-sm, bg-primary, fixed-top',
          'navbar-dark navbar-expand-sm bg-primary fixed-bottom': 'navbar-dark, expand-sm, bg-primary, fixed-bottom',
          'navbar-dark navbar-expand-sm bg-primary static-top': 'navbar-dark, expand-sm, bg-primary, static-top',
          'navbar-dark navbar-expand-md bg-primary': 'navbar-dark, expand-md, bg-primary, default',
          'navbar-dark navbar-expand-md bg-primary fixed-top': 'navbar-dark, expand-md, bg-primary, fixed-top',
          'navbar-dark navbar-expand-md bg-primary fixed-bottom': 'navbar-dark, expand-md, bg-primary, fixed-bottom',
          'navbar-dark navbar-expand-md bg-primary static-top': 'navbar-dark, expand-md, bg-primary, static-top',
          'navbar-dark navbar-expand-lg bg-primary': 'navbar-dark, expand-lg, bg-primary, default',
          'navbar-dark navbar-expand-lg bg-primary fixed-top': 'navbar-dark, expand-lg, bg-primary, fixed-top',
          'navbar-dark navbar-expand-lg bg-primary fixed-bottom': 'navbar-dark, expand-lg, bg-primary, fixed-bottom',
          'navbar-dark navbar-expand-lg bg-primary static-top': 'navbar-dark, expand-lg, bg-primary, static-top',
          'navbar-dark navbar-expand-xl bg-primary': 'navbar-dark, expand-xl, bg-primary, default',
          'navbar-dark navbar-expand-xl bg-primary fixed-top': 'navbar-dark, expand-xl, bg-primary, fixed-top',
          'navbar-dark navbar-expand-xl bg-primary fixed-bottom': 'navbar-dark, expand-xl, bg-primary, fixed-bottom',
          'navbar-dark navbar-expand-xl bg-primary static-top': 'navbar-dark, expand-xl, bg-primary, static-top'
        }
      }

      // json
      if (['partial', 'cck'].indexOf(key) > -1) {
        cckState.schema.fields.value.inputTemplate = getTemplate(config.cck.input.jsonText)
      }
    }
    callback(null, cckState)
  } catch (error) {
    callback(error, cckState)
  }
}
