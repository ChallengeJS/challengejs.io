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
  var msg = e.data.message;
  try {
    msg = JSON.parse(msg);
  } catch(e) {
    console.error('msg is not valid json');
    return;
  }
  listeners.forEach(fn => fn(msg));
});
