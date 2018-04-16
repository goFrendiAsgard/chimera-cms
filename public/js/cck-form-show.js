/* eslint-env jquery */

if (typeof $ === 'undefined') {
  var ejs = {}
  var cwAdjustDflexTables = () => {}
  var history = {}
  module.exports = {
    cwAjaxifyShow,
    cwState
  }
}

function cwState (...args) {
  const availableKeys = ['excludeDeleted', 'limit', 'offset', 'q', 'k', 'sort']

  function getCckState (key) {
    return $('#cw-input-' + key).val()
  }

  function setCckState (key, val) {
    if (Object(val) === val) {
      val = JSON.stringify(val)
    }
    return $('#cw-input-' + key).val(val)
  }

  function reload () {
    $('#cw-input-q').trigger('change')
  }

  if (args.length === 0) {
    // return cckState
    let cckState = {}
    for (let key in availableKeys) {
      cckState[key] = getCckState(key)
    }
    return cckState
  } else if (args.length === 1) {
    if (args[0] === Object(args[0])) {
      // set cckState for provided key
      let newCckState = args[0]
      for (let key in newCckState) {
        setCckState(key, newCckState[key])
      }
      reload()
    } else {
      // get cckState for the specific key
      let key = args[0]
      return getCckState(key)
    }
  } else if (args.length === 2) {
    // set cckState for key and value
    let key = args[0]
    let val = args[1]
    setCckState(key, val)
    reload()
  }
}

function cwAjaxifyShow () {
  var cckState, rowTemplate, paginationTemplate

  // load cckState from the hidden inputs
  function cwLoadCckState () {
    cckState.excludeDeleted = $('#cw-input-excludeDeleted').val()
    cckState.limit = $('#cw-input-limit').val()
    cckState.offset = $('#cw-input-offset').val()
    cckState.q = $('#cw-input-q').val()
    cckState.k = $('#cw-input-k').val()
    cckState.sort = $('#cw-input-sort').val()
  }

  function cwGetQueryUrl () {
    cwLoadCckState()
    return '?excludeDeleted=' + cckState.excludeDeleted + '&limit=' + cckState.limit + '&offset=' + cckState.offset + '&q=' + cckState.q + '&k=' + cckState.k + '&sort=' + cckState.sort
  }

  // get data presentation in HTML format
  function cwRenderResults (cckState, rowTemplate, data) {
    let html = ''
    let results = data.results
    for (let row of results) {
      html += ejs.render(rowTemplate, {cckState, row})
    }
    return html
  }

  // get pagination in HTML format
  function cwRenderPagination (cckState, paginationTemplate, data) {
    let metadata = data.metadata
    return ejs.render(paginationTemplate, {cckState, metadata})
  }

  // render data with all it's visual accessories
  function cwRender (cckState, rowTemplate, paginationTemplate, data) {
    data = (typeof data === 'undefined' || data === null) ? JSON.parse($('#cw-initial-data').val()) : data
    let renderedResults = cwRenderResults(cckState, rowTemplate, data)
    let renderedPagination = cwRenderPagination(cckState, paginationTemplate, data)
    $('#cw-result-container').html(renderedResults)
    $('#cw-pagination').html(renderedPagination)
    cwAdjustDflexTables()
    cwAdjustSortIcon()
  }

  // send AJAX request and call cwRender
  function cwReload () {
    cwLoadCckState()
    let queryUrl = cwGetQueryUrl()
    $.ajax({
      url: '/api/v1/' + cckState.schemaName + queryUrl,
      method: 'get',
      dataType: 'json',
      success: function (data, textStatus, jqXhr) {
        if (data.status < 400) {
          cwRender(cckState, rowTemplate, paginationTemplate, data)
          history.pushState({}, '', '/data/' + cckState.schemaName + '/' + queryUrl)
        } else {
          console.log(textStatus)
        }
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.error(errorThrown)
      }
    })
  }

  // get sort Object
  function cwGetSort () {
    cwLoadCckState()
    let sort
    try {
      sort = JSON.parse(cckState.sort)
    } catch (error) {
      sort = {}
    }
    if (!(typeof sort === 'object')) {
      sort = {}
    }
    return sort
  }

  // adjust sortIcon (.cw-sort-icon[field="fieldName"])
  function cwAdjustSortIcon () {
    let sort = cwGetSort()
    let keys = Object.keys(sort)
    $('.cw-sort').each(function () {
      let fieldName = $(this).attr('field')
      let state = fieldName in sort ? sort[fieldName] : 0
      let index = '<sup>' + (keys.indexOf(fieldName) + 1) + '</sup>'
      if (state === -1 || state === '-1') {
        $('.cw-sort-icon[field="' + fieldName + '"]').html('&#9652 ' + index)
      } else if (state === 1 || state === '1') {
        $('.cw-sort-icon[field="' + fieldName + '"]').html('&#9662 ' + index)
      } else {
        $('.cw-sort-icon[field="' + fieldName + '"]').html('')
      }
    })
  }

  // on change, call reload
  $('#cw-input-excludeDeleted, #cw-input-limit, #cw-input-offset, #cw-input-q, #cw-input-k, #cw-input-sort').change(function (event) {
    event.preventDefault()
    cwReload()
  })

  // on key-enter, call reaload
  $('#cw-input-excludeDeleted, #cw-input-limit, #cw-input-offset, #cw-input-q, #cw-input-k, #cw-input-sort').keypress(function (event) {
    if (event.keyCode === 13) {
      event.preventDefault()
      cwReload()
    }
  })

  // sort-icon click
  $('.cw-sort').click(function (event) {
    let fieldName = $(this).attr('field')
    let sort = cwGetSort()
    let state = fieldName in sort ? sort[fieldName] : 0
    state = (state === 1 || state === '1') ? -1 : state + 1
    if (state === 0 || state === '0') {
      delete sort[fieldName]
    } else {
      sort[fieldName] = state
    }
    $('#cw-input-sort').val(JSON.stringify(sort))
    cwReload()
  })

  // page navigation click
  $('body').on('click', '.cw-page-item .cw-page-link', function (event) {
    event.preventDefault()
    $('#cw-input-offset').val($(this).attr('offset'))
    cwReload()
  })

  $(document).ready(function (event) {
    cckState = JSON.parse($('#cw-cckState').val())
    rowTemplate = $('#cw-row-template').val()
    paginationTemplate = $('#cw-pagination-template').val()
    cwRender(cckState, rowTemplate, paginationTemplate)
  })

  $('#cw-btn-close-delete-modal').click(function (event) {
    event.preventDefault()
    $('#cw-delete-modal').modal('hide')
  })

  $('#cw-btn-close-advance-search-modal').click(function (event) {
    event.preventDefault()
    $('#cw-advance-search-modal').modal('hide')
  })

  $('#cw-advance-search-modal').on('hidden.bs.modal', function (event) {
    $('#cw-input-excludeDeleted').val($('#cw-advance-excludeDeleted').is(':checked') ? 1 : 0)
    $('#cw-input-limit').val($('#cw-advance-limit').val())
    $('#cw-input-q').val($('#cw-advance-q').val())
    cwReload()
  })

  $('body').on('click', '.cw-btn-delete', function (event) {
    event.preventDefault()
    let rowId = $(this).attr('rowid')
    $.ajax({
      url: '/api/v1/' + cckState.schemaName + '/' + rowId + '?excludeDeleted=' + cckState.excludeDeleted,
      method: 'delete',
      dataType: 'json',
      success: function (data, textStatus, jqXhr) {
        if (data.status < 400) {
          $('#cw-delete-modal-alert').removeClass('alert-danger')
          $('#cw-delete-modal-alert').addClass('alert-success')
          $('#cw-delete-modal-alert').html('<strong>Success</strong>' + data.userMessage)
          $('#cw-row-' + rowId).remove()
        } else {
          $('#cw-delete-modal-alert').removeClass('alert-success')
          $('#cw-delete-modal-alert').addClass('alert-danger')
          $('#cw-delete-modal-alert').html('<strong>Failed</strong>' + data.userMessage)
          console.log(data)
        }
        $('#cw-delete-modal').modal('show')
      },
      error: function (jqXhr, textStatus, errorThrown) {
        $('#cw-delete-modal-alert').removeClass('alert-success')
        $('#cw-delete-modal-alert').addClass('alert-danger')
        $('#cw-delete-modal-alert').html('<strong>Failed</strong>' + textStatus)
        console.error(errorThrown)
        $('#cw-delete-modal').modal('show')
      }
    })
  })
}
