const $ = require('jquery');
const CodeMirror = require('codemirror');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/dracula.css');
require('codemirror/mode/javascript/javascript');

let submitListeners = [];
function addSubmitListener(fn) {
  submitListeners.push(fn);
};

function triggerSubmitListeners() {
  submitListeners.forEach(fn => fn());
};

let mirror = CodeMirror(document.querySelector('#editor'), {
  mode: 'javascript',
  lineNumbers: true,
  theme: 'dracula',
  value: window.challenge.code,
  extraKeys: {
    'Shift-Enter': triggerSubmitListeners
  }
});

mirror.onSubmit = addSubmitListener
module.exports = {
  editor: mirror
};
