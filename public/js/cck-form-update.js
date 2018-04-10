/* eslint-env jquery */

if (typeof $ === 'undefined') {
  var cwAjaxifyForm = () => {}
}

function cwAjaxifyUpdateForm (schemaName, documentId) {
  $(document).ready(function () {
    // button re-edit
    $('#cw-btn-re-edit').click(function (event) {
      event.preventDefault()
      $('#cw-modal').modal('hide')
    })
    // ajaxify
    cwAjaxifyForm('cw-form', {
      method: 'PUT',
      action: '/api/v1/' + schemaName + '/' + documentId,
      dataType: 'json',
      success: function (data, textStatus, jqXhr) {
        if (data.status < 400) {
          $('#cw-modal-alert').removeClass('alert-danger')
          $('#cw-modal-alert').addClass('alert-success')
          $('#cw-modal-alert').html('<strong>Success</strong> ' + data.userMessage)
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
