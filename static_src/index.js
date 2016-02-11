const $ = require('jquery');
const process = require('./processMessage');
const {editor} = require('./editor');

require('./app.styles.css');

editor.onSubmit(submitCode);
$('#entry').click(function(e) {
  e.preventDefault();
  submitCode();
});
process.onResult(printResults);

function submitCode() {
  sendResponse(getCode(), refreshFrame);
}

function getCode() {
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


function printResults(results) {
  var levels = ['challenge', 'bonus', 'hard'];
  var wrapper = $('#challengeResults').empty();
  console.log('got results', results);

  levels.forEach(function(lvl) {
    var res = results[lvl];

    wrapper.append(makeChallengeGroup(res, lvl));
  });
}

function makeChallengeGroup(group, lvl) {
  if (!group) {
    console.log('group is undefined');
    return 'There was an error!'
  }
  return $('<div class="challenge-group"><div class="group-heading">' + lvl + '</div></div>')
      .addClass(group.pass ? 'challenge-pass' : 'challenge-fail')
      .append(group.errors.map(makeTestLine));
}

function makeTestLine( msg) {
  return $('<div class="challenge-answer" />')
      .text(msg);
}
