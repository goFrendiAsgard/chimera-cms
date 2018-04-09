/* eslint-env jquery */

if (typeof $ === 'undefined') {
  var ace = {}
  var ejs = {}
  var FormData = {}
}

function cwAjaxifyForm (formId, options = {}) {
  let form = $('#' + formId)
  let method = ('method' in options ? options.method : form.attr('method') ? form.attr('method') : 'get').toUpperCase()
  let action = 'action' in options ? options.action : form.attr('action') ? form.attr('action') : ''
  let success = 'success' in options ? options.success : function (data, textStatus, jqXhr) { console.log(data) }
  let error = 'error' in options ? options.error : function (jqXhr, textStatus, errorThrown) { console.error(errorThrown) }
  let dataType = 'dataType' in options ? options.dataType : 'html'
  form.submit(function (event) {
    event.preventDefault()
    var data = new FormData(document.getElementById(formId))
    $.ajax({
      url: action,
      method: method,
      data: data,
      dataType: dataType,
      contentType: false,
      processData: false,
      cache: false,
      success: success,
      error: error
    })
  })
}

function cwAdjustDflexTables () {
  $('tr.d-flex').each(function () {
    let allowedWidth = $(this).outerWidth()
    let totalWidth = 0
    $(this).children('th, td').each(function () {
      totalWidth += $(this).outerWidth()
    })
    if (totalWidth > allowedWidth) {
      $(this).children('th, td').removeClass('col-1 col-2 col-3 col-4 col-5 col-6 col-7 col-8 col-9 col-10 col-11 col-12').addClass('col')
    }
  })
}

function cwInitAce () {
  $('textarea[data-editor]').each(function () {
    let textarea = $(this)
    if (!textarea.attr('rendered')) {
      let mode = textarea.data('editor') ? textarea.data('editor') : 'ejs'
      let editDiv = $('<div>', {
        position: 'absolute',
        // width: textarea.width(),
        height: textarea.height(),
        'class': textarea.attr('class')
      }).insertBefore(textarea)
      textarea.css('display', 'none')
      let editor = ace.edit(editDiv[0])
      editor.renderer.setShowGutter(false)
      editor.setOptions({
        showLineNumbers: true,
        showGutter: true,
        fontSize: 14,
        minLines: 5,
        maxLines: 35
      })
      editor.$blockScrolling = Infinity
      editor.setTheme('ace/theme/github')
      editor.getSession().setMode('ace/mode/' + mode)
      editor.getSession().setTabSize(2)
      editor.getSession().setUseSoftTabs(true)
      editor.getSession().setValue(textarea.val())
      editor.getSession().on('change', function () {
        textarea.val(editor.getSession().getValue())
      })
      textarea.change(function (event) {
        editor.setValue($(this).val(), 1)
      })
      textarea.attr('rendered', '1')
    }
  })
}

function cwSwitchTab (tab) {
  $('#form-tabs li').removeClass('active')
  $('#form-tabs li a').removeClass('active')
  $('#form-tabs a.nav-link[href="#' + tab + '"]').addClass('active')
  $('#form-tabs a.nav-link[href="#' + tab + '"]').parent('li').addClass('active')
  $('*[data-tab]').hide()
  $('*[data-tab="' + tab + '"], *[data-tab=""]').show()
}

function cwAfterLoadTable () {
  cwInitAce()
  cwAdjustDflexTables()
  setTimeout(function () {
    cwInitAce()
    cwAdjustDflexTables()
  }, 300)
}

function cwPreprocessValue (value) {
  if (value === null || typeof value === 'undefined' || (typeof value === 'string' && value.trim() === '')) {
    return '<i>[Not set]</i>'
  }
  return value
}

function cwLoadMany2OnePresentationContainer (componentId, componentFieldInfo) {
  let {ref, keyField, fields} = componentFieldInfo
  let value = $('#' + componentId).val()
  let q = {}
  q[keyField] = value
  $.ajax({
    url: '/api/v1/' + ref + '?includeFieldInfo=1&q=' + JSON.stringify(q),
    method: 'get',
    dataType: 'json',
    success: function (response) {
      let results = response.results
      let fieldInfoList = response.metadata.fieldInfo
      let html = ''
      if (results.length === 0) {
        html = value
      } else {
        let row = results[0]
        if (fields.length === 1) {
          html = row[fields[0]]
        } else {
          html += '<div class="row container" style="font-size:small">'
          for (let fieldName of fields) {
            let fieldInfo = fieldInfoList[fieldName]
            let caption = fieldInfo.caption
            let value = row[fieldName]
            let template = 'tabularPresentationTemplate' in fieldInfo ? fieldInfo.tabularPresentationTemplate : fieldInfo.presentationTemplate
            let presentation = ejs.render(template, {row, fieldName, fieldInfo, value})
            html += '<div class="col-sm-4" style="padding-left:0px; overflow-x:hidden;"><b>' + caption + '</b></div>'
            html += '<div class="col-sm-8">' + cwPreprocessValue(presentation) + '</div>'
          }
          html += '</div>'
        }
      }
      html = cwPreprocessValue(html)
      $('#' + componentId + 'PresentationContainer').html(html)
      cwAfterLoadTable()
    }
  })
}

function cwGetTableHeader (fields, fieldInfoList, addAction = false) {
  // table header
  let html = '<tr class="d-flex">'
  for (let fieldName of fields) {
    let fieldInfo = fieldInfoList[fieldName]
    let colClass = fieldInfo.bootstrapColWidth ? 'col-' + fieldInfo.bootstrapColWidth : 'col'
    html += '<th class="' + colClass + '">' + fieldInfoList[fieldName].caption + '</th>'
  }
  if (addAction) {
    html += '<th class="col">Action</th>'
  }
  html += '</tr>'
  return html
}

function cwLoadMany2OneInputContainer (componentId, componentFieldInfo) {
  $('#' + componentId + 'InputContainer').html('')
  let {ref, keyField, fields} = componentFieldInfo
  let keyword = $('#' + componentId + 'SearchBox').val()
  $.ajax({
    url: '/api/v1/' + ref + '?includeFieldInfo=1&k=' + keyword,
    method: 'get',
    dataType: 'json',
    success: function (response) {
      let results = response.results
      let fieldInfoList = response.metadata.fieldInfo
      // build the table
      let html = '<table class="table cw-table">'
      // table header
      html += '<thead>'
      html += cwGetTableHeader(fields, fieldInfoList, true)
      html += '</thead>'
      // table content
      html += '<tbody style="max-height:300px;">'
      for (let row of results) {
        html += '<tr class="row-data d-flex">'
        for (let fieldName of fields) {
          let fieldInfo = fieldInfoList[fieldName]
          let value = row[fieldName]
          let template = 'tabularPresentationTemplate' in fieldInfo ? fieldInfo.tabularPresentationTemplate : fieldInfo.presentationTemplate
          let presentation = ejs.render(template, {row, fieldInfo, value, fieldName})
          let colClass = fieldInfo.bootstrapColWidth ? 'col-' + fieldInfo.bootstrapColWidth : 'col'
          html += '<td class="' + colClass + '">'
          html += '<div class="row container">' + presentation + '</div>'
          html += '</td>'
        }
        html += '<td class="col"><a class="' + componentId + 'BtnSelect btn btn-secondary btn-sm" value="' + row[keyField] + '" href="#" data-toggle="modal" data-target="#' + componentId + 'ModalContainer"><span class="oi oi-check"></span></a></td>'
        html += '</tr>'
      }
      html += '</tbody>'
      // end of the table
      html += '</table>'
      $('#' + componentId + 'InputContainer').html(html)
      cwAfterLoadTable()
    }
  })
}

function cwGetOne2ManyFieldValue (componentId) {
  let value = $('#' + componentId).val()
  try {
    value = JSON.parse(value)
  } catch (error) {
    value = []
  }
  return value
}

function cwLoadOne2ManyPresentationContainer (componentId, componentFieldInfo) {
  let fieldInfoList = componentFieldInfo.fields
  let fields = Object.keys(fieldInfoList)
  let value = cwGetOne2ManyFieldValue(componentId)
  let html = ''
  if (value.length > 0) {
    html += '<table class="table cw-table" style="font-size:small">'
    // table header
    html += '<thead>'
    html += cwGetTableHeader(fields, fieldInfoList)
    html += '</thead>'
    // table content
    html += '<tbody style="max-height:300px;">'
    for (let row of value) {
      html += '<tr class="d-flex">'
      for (let fieldName of fields) {
        let fieldInfo = fieldInfoList[fieldName]
        let value = row[fieldName]
        let template = 'tabularPresentationTemplate' in fieldInfo ? fieldInfo.tabularPresentationTemplate : fieldInfo.presentationTemplate
        let presentation = ejs.render(template, { row, fieldName, fieldInfo, value })
        let colClass = fieldInfo.bootstrapColWidth ? 'col-' + fieldInfo.bootstrapColWidth : 'col'
        html += '<td class="' + colClass + '">'
        html += '<div class="row container">' + presentation + '</div>'
        html += '</td>'
      }
      html += '</tr>'
    }
    html += '</tbody>'
    html += '</table>'
  }
  html = cwPreprocessValue(html)
  $('#' + componentId + 'PresentationContainer').html(html)
  cwAfterLoadTable()
}

function cwGetOne2ManyTableRow (row, fieldInfoList) {
  let html = '<tr class="row-data d-flex">'
  for (let fieldName in fieldInfoList) {
    let fieldInfo = fieldInfoList[fieldName]
    let value = fieldName in row ? row[fieldName] : ''
    let presentation = ejs.render(fieldInfo['inputTemplate'], { row, fieldName, fieldInfo, value })
    let colClass = fieldInfo.bootstrapColWidth ? 'col-' + fieldInfo.bootstrapColWidth : 'col'
    html += '<td class="' + colClass + '" fieldName="' + fieldName + '">'
    html += '<div class="row container">' + presentation + '</div>'
    html += '</td>'
  }
  html += '<td class="col">'
  html += '<a class="btnPasteBeforeRow btnAction btn btn-sm btn-secondary" style="display:none;" href="#"><span class="oi oi-chevron-top"></span></a>&nbsp;'
  html += '<a class="btnPasteAfterRow btnAction btn btn-sm btn-secondary" style="display:none;" href="#"><span class="oi oi-chevron-bottom"></span></a>&nbsp;'
  html += '<a class="btnCancelCutRow btnAction btn btn-sm btn-secondary" style="display:none;" href="#"><span class="oi oi-action-undo"></span></a>&nbsp;'
  html += '<a class="btnCutRow btn btn-sm btnAction btn-secondary" href="#"><span class="oi oi-clipboard"></span></a>&nbsp;'
  html += '<a class="btnDeleteRow btn btn-sm btnAction btn-secondary" href="#"><span class="oi oi-trash"></span></a>&nbsp;'
  html += '</td>'
  html += '</tr>'
  return html
}

function cwLoadOne2ManyInputContainer (componentId, componentFieldInfo) {
  $('#' + componentId + 'InputContainer').html('')
  let fieldInfoList = componentFieldInfo.fields
  let fields = Object.keys(fieldInfoList)
  let value = cwGetOne2ManyFieldValue(componentId)
  if (!Array.isArray(value)) { value = [] }
  let html = '<table id="' + componentId + 'Table" class="table cw-table">'
  // table header
  html += '<thead>'
  html += cwGetTableHeader(fields, fieldInfoList, true)
  html += '</thead>'
  // table content
  html += '<tbody style="max-height:300px;">'
  for (let row of value) {
    html += cwGetOne2ManyTableRow(row, fieldInfoList)
  }
  html += '</tbody>'
  html += '</table>'
  $('#' + componentId + 'InputContainer').html(html)
  cwAfterLoadTable()
}

function cwRenderResults (cckState, rowTemplate, data) {
  let html = ''
  let results = data.results
  for (let row of results) {
    html += ejs.render(rowTemplate, {cckState, row})
  }
  return html
}

function cwRenderPagination (cckState, paginationTemplate, data) {
  let metadata = data.metadata
  return ejs.render(paginationTemplate, {cckState, metadata})
}

$(document).ready(function () {
  // init aceEditors
  cwInitAce()

  // adjust dflex tables
  cwAdjustDflexTables()

  // handle tabs
  if ($('#form-tabs li.active a').attr('href')) {
    let tab = $('#form-tabs li.active a').attr('href').slice(1)
    // don't know, but seems we have to delay this in order to make ace rendered correctly
    setTimeout(function () { cwSwitchTab(tab) }, 50)
  }
  $('#form-tabs a.nav-link').click(function (event) {
    let tab = $(this).attr('href').slice(1)
    cwSwitchTab(tab)
    event.preventDefault()
  })
})
