(function ($, _) {
  var endpoint = 'https://phl.carto.com/api/v2/sql/'
  var table = 'public_cases_fc'
  var params = qs(window.location.search.substr(1))
  // Use mustache.js style brackets in templates
  _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g }
  var templates = {
    result: _.template($('#tmpl-result').html()),
    error: _.template($('#tmpl-error').html()),
    loading: $('#tmpl-loading').html()
  }
  var resultContainer = $('#result')

  if (params.id) {
    resultContainer.html(templates.loading)
    var query = constructQuery(params.id)
    $.getJSON(endpoint, { q: query }, function (response) {
      if (response.rows.length < 1) {
        // If there's no response or if there's an error, indicate such
        resultContainer.html(templates.error({ service_request_id: params.id }))
      } else {
        // Otherwise display the result
        var request = response.rows[0]
        resultContainer.html(templates.result(request))
      }
    }).fail(function () {
      resultContainer.html(templates.error({ service_request_id: params.id }))
    })
  }

  function constructQuery (id) {
    return "select * from " + table + " where service_request_id = '" + params.id + "'"
  }

  // decode a uri into a kv representation :: str -> obj
  // https://github.com/yoshuawuyts/sheet-router/blob/master/qs.js
  function qs (uri) {
    var obj = {}
    var reg = new RegExp('([^?=&]+)(=([^&]*))?', 'g')
    uri.replace(/^.*\?/, '').replace(reg, map)
    return obj

    function map (a0, a1, a2, a3) {
      obj[window.decodeURIComponent(a1)] = window.decodeURIComponent(a3)
    }
  }
})(window.jQuery, window._)
