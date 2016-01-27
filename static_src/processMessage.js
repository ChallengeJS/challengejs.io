const $ = require('jquery');

module.exports = {
  onResult: onResultRecieved,
};

let listeners = [];

function onResultRecieved(fn) {
  listeners.push(fn);
}

$(window).on('message', event => {
  const e = event.originalEvent;
  console.log('got a post message from', e.origin);
  console.log('message body is', e.data);
  listeners.forEach(fn => fn(e.data.message));
});
