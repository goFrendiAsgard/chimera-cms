/* eslint-env jquery */
function cwAdjustDflexTables () {
  $('tr.d-flex').each(function () {
    let allowedWidth = $(this).width()
    let totalWidth = 0
    $(this).children('th, td').each(function () {
      totalWidth += $(this).outerWidth()
    })
    if (totalWidth > allowedWidth) {
      $(this).children('th, td').removeClass('col-1 col-2 col-3 col-4 col-5 col-6 col-7 col-8 col-9 col-10 col-11 col-12').addClass('col')
    }
  })
}

$(document).ready(function () {
  cwAdjustDflexTables()
})
