"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnCallback = exports.handleError = void 0;
const readline_1 = __importDefault(require("readline"));
const handleError = (code = 1, message = '') => {
    console.error(message);
    process.exit(code);
};
exports.handleError = handleError;
const progressiveTerminalLine = (data) => {
    readline_1.default.clearLine(process.stdout, 0);
    readline_1.default.cursorTo(process.stdout, 0, null);
    process.stdout.write(data);
};
const spawnCallback = (data, isProgressive = false, callback = null) => {
    const dataToLog = (Buffer.isBuffer(data) == true) ? data.toString() : data;
    if (typeof callback === 'function') {
        if (isProgressive) {
            progressiveTerminalLine(dataToLog);
            callback(dataToLog);
        }
        else {
            console.log(dataToLog);
            callback(dataToLog);
        }
    }
    else {
        if (isProgressive) {
            progressiveTerminalLine(dataToLog);
        }
        else {
            console.log(dataToLog);
        }
    }
};
exports.spawnCallback = spawnCallback;
