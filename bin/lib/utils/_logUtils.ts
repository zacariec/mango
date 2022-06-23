import readline from 'readline';

const handleError = (code = 1, message = ''): void => {
  console.error(message);
  return process.exit(code);
};

const progressiveTerminalLine = (data: string | Buffer): void => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0, null);
  process.stdout.write(data);
};

const spawnCallback = (data: string | Buffer, isProgressive = false, callback: null | ((string) => void) = null) => {
  const dataToLog = (Buffer.isBuffer(data) == true)
    ? data.toString()
    : data;

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

export {
  handleError,
  spawnCallback
};
