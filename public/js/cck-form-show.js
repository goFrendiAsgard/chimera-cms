/* eslint-env jquery */

if (typeof $ === 'undefined') {
  var cwRenderResults = () => {}
  var cwRenderPagination = () => {}
  var cwAdjustDflexTables = () => {}
}

function cwAjaxifyShow () {

  var cckState, rowTemplate, paginationTemplate

  function cwRender (cckState, rowTemplate, paginationTemplate, data) {
    data = (typeof data === 'undefined' || data === null) ? JSON.parse($('#cw-initial-data').val()) : data
    let renderedResults = cwRenderResults(cckState, rowTemplate, data)
    let renderedPagination = cwRenderPagination(cckState, paginationTemplate, data)
    $('#cw-result-container').html(renderedResults)
    $('#cw-pagination').html(renderedPagination)
    cwAdjustDflexTables()
    cwAdjustSortIcon()
  }

  function cwReload () {
    cckState.excludeDeleted = $('#cw-input-excludeDeleted').val()
    cckState.limit = $('#cw-input-limit').val()
    cckState.offset = $('#cw-input-offset').val()
    cckState.q = $('#cw-input-q').val()
    cckState.k = $('#cw-input-k').val()
    cckState.sort = $('#cw-input-sort').val()
    let urlQuery = '?excludeDeleted=' + cckState.excludeDeleted + '&limit=' + cckState.limit + '&offset=' + cckState.offset + '&q=' + cckState.q + '&k=' + cckState.k + '&sort=' + cckState.sort
    $.ajax({
      url: '/api/v1/' + cckState.schemaName + urlQuery,
      method: 'get',
      dataType: 'json',
      success: function (data, textStatus, jqXhr) {
        if (data.status < 400) {
          cwRender(cckState, rowTemplate, paginationTemplate, data)
          history.pushState({}, '', '/data/' + cckState.schemaName + '/' + urlQuery)
        } else {
          console.log(textStatus)
        }
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.error(errorThrown)
      }
    })
  }

  function cwGetSort () {
    let sort
    try {
      sort = JSON.parse($('#cw-input-sort').val())
    } catch (error) {
      sort = {}
    }
    if (!(typeof sort === 'object')) {
      sort = {}
    }
    return sort
  }

  function cwAdjustSortIcon () {
    let sort = cwGetSort()
    $('.cw-sort').each(function () {
      let fieldName = $(this).attr('field')
      let state = fieldName in sort ? sort[fieldName] : 0
      if (state === -1 || state === '-1') {
        $('.cw-sort-icon[field="' + fieldName + '"]').html('&#9652')
      } else if (state === 1 || state === '1') {
        $('.cw-sort-icon[field="' + fieldName + '"]').html('&#9662')
      } else {
        $('.cw-sort-icon[field="' + fieldName + '"]').html('')
      }
    })
  }

  $('#cw-input-excludeDeleted, #cw-input-limit, #cw-input-offset, #cw-input-q, #cw-input-k, #cw-input-sort').change(function (event) {
    cwReload()
  })

  $('#cw-input-excludeDeleted, #cw-input-limit, #cw-input-offset, #cw-input-q, #cw-input-k, #cw-input-sort').keypress(function (event) {
    if (event.keyCode === 13) {
      event.preventDefault()
      cwReload()
    }
  })

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
