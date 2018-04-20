/* eslint-env jquery */

if (typeof $ === 'undefined') {
  var cwAjaxifyForm = () => {}
  module.exports = {
    cwAjaxifyInsertForm
  }
}

function cwAjaxifyInsertForm (schemaName) {
  $(document).ready(function () {
    // ajaxify
    cwAjaxifyForm('cw-form', {
      method: 'POST',
      action: '/api/v1/' + schemaName,
      dataType: 'json',
      success: function (data, textStatus, jqXhr) {
        $('#cw-btn-re-edit').hide()
        if (data.status < 400) {
          $('#cw-modal-alert').removeClass('alert-danger')
          $('#cw-modal-alert').addClass('alert-success')
          $('#cw-modal-alert').html('<strong>Success</strong> ' + data.userMessage)
          if ('_id' in data.result) {
            let excludeDeleted = $('#cw-btn-re-edit').attr('excludeDeleted')
            let limit = $('#cw-btn-re-edit').attr('limit')
            $('#cw-btn-re-edit').attr('href', '/data/' + schemaName + '/update/' + data.result._id + '?excludeDeleted=' + excludeDeleted + '&limit=' + limit)
            $('#cw-btn-re-edit').show()
          }
        } else {
          $('#cw-modal-alert').removeClass('alert-success')
          $('#cw-modal-alert').addClass('alert-danger')
          $('#cw-modal-alert').html('<strong>Failed</strong> ' + data.userMessage)
          console.log(data)
        }
        $('#cw-modal').modal('show')
      },
      error: function (jqXhr, textStatus, errorThrown) {
        $('#cw-modal-alert').removeClass('alert-success')
        $('#cw-modal-alert').addClass('alert-danger')
        $('#cw-modal-alert').html('<strong>Failed</strong> ' + textStatus)
        console.error(errorThrown)
        $('#cw-modal').modal('show')
      }
    })
  })
}
