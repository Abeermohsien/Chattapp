const moment = require('moment');
//formatting masseges
function formatingmess(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = formatingmess;
