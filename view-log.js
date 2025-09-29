const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'oauth-debug.log');

console.log('=== OAUTH DEBUG LOG ===');
console.log('Log file location:', LOG_FILE);
console.log('');

if (fs.existsSync(LOG_FILE)) {
  const logContent = fs.readFileSync(LOG_FILE, 'utf8');
  console.log(logContent);
} else {
  console.log('Log file does not exist yet. Try running the OAuth flow first.');
}