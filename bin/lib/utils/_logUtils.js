const handleError = (code = 1, message = '') => {
  console.error(message);
  process.exit(code);
};

const progressiveTerminalLine = (data) => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
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