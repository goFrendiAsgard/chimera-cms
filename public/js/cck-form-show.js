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
  }

  function cwReload () {
    cckState.excludeDeleted = $('#cw-input-excludeDeleted').val()
    cckState.limit = $('#cw-input-limit').val()
    cckState.offset = $('#cw-input-offset').val()
    cckState.q = $('#cw-input-q').val()
    cckState.k = $('#cw-input-k').val()
    $.ajax({
      url: '/api/v1/' + cckState.schemaName + '?excludeDeleted=' + cckState.excludeDeleted + '&limit=' + cckState.limit + '&offset=' + cckState.offset + '&q=' + cckState.q + '&k=' + cckState.k,
      method: 'get',
      dataType: 'json',
      success: function (data, textStatus, jqXhr) {
        if (data.status < 400) {
          cwRender(cckState, rowTemplate, paginationTemplate, data)
          if (cckState.excludeDeleted == 1) {
            $('#cw-icon-toggle-show-all').removeClass('oi-eye')
            $('#cw-icon-toggle-show-all').addClass('oi-ellipses')
          } else {
            $('#cw-icon-toggle-show-all').removeClass('oi-ellipses')
            $('#cw-icon-toggle-show-all').addClass('oi-eye')
          }
        } else {
          console.error(textStatus)
        }
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.error(errorThrown)
      }
    })
  }

  $('#cw-input-excludeDeleted, #cw-input-limit, #cw-input-offset, #cw-input-q, #cw-input-k').change(function (event) {
    cwReload()
  })

  $('#cw-input-excludeDeleted, #cw-input-limit, #cw-input-offset, #cw-input-q, #cw-input-k').keypress(function (event) {
    if (event.keyCode === 13) {
      event.preventDefault()
      cwReload()
    }
  })

  $('#cw-btn-toggle-show-all').click(function (event) {
    event.preventDefault()
    $('#cw-input-excludeDeleted').val(cckState.excludeDeleted == 1 ? 0 : 1)
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

  $('body').on('click', '.cw-btn-delete', function (event) {
    event.preventDefault()
    let rowId = $(this).attr('rowid')
    console.log(rowId)
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
