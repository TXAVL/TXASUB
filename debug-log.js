// Debug logging utility
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'oauth-debug.log');

function logToFile(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  fs.appendFileSync(LOG_FILE, logMessage);
  console.log(message); // Also log to console
}

// Override console.log to also write to file
const originalConsoleLog = console.log;
console.log = function(...args) {
  originalConsoleLog.apply(console, args);
  logToFile(args.join(' '));
};

module.exports = { logToFile };