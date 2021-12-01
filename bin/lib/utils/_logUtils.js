const readline = require('readline');

const handleError = (code = 1, message = '') => {
  console.error(message);
  process.exit(code);
};

const progressiveTerminalLine = (data) => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0, null);
  process.stdout.write(data);
};

const spawnCallback = (data, isProgressive = false, callback = null) => {
  const dataToLog = (Buffer.isBuffer(data) == true) ? data.toString() : data;
  if (typeof callback === 'function') {
    if (isProgressive) {
      progressiveTerminalLine(dataToLog);
      callback(dataToLog);
    } else {
      console.log(dataToLog);
      callback(dataToLog);
    }
  } else {
    if (isProgressive) {
      progressiveTerminalLine(dataToLog);
    } else {
      console.log(dataToLog);
    }
  }
};

module.exports = {
  handleError,
  spawnCallback
};