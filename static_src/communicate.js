
module.exports = {
  sendToParent: sendToParent
};


function sendToParent(message) {
  var msg = {
    message: JSON.stringify(message)
  };

  window.parent.postMessage(msg, "http://localhost:8001");
}
