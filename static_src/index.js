
const $ = require('jquery');
const process = require('./processMessage');
const {editor} = require('./editor');

function submitCode() {
  sendResponse(getCode(), refreshFrame);
}

$('#entry').click(function(e) {
  e.preventDefault();
  submitCode();
});

editor.onSubmit(submitCode);

function getCode(form) {
  return {
    code: editor.getValue()
  }
}

function sendResponse(formData, afterEffect) {
  $.ajax(`/submissions/${challenge.id}`, {
    method: 'POST',
    data: JSON.stringify(formData),
    contentType: 'application/json'
  }).always(afterEffect);
}

function refreshFrame() {
  var frame = $('#contentFrame');
  frame.attr('src', `/embed/${challenge.id}?${Math.random()}`);
}
