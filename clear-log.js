const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'oauth-debug.log');

if (fs.existsSync(LOG_FILE)) {
  fs.unlinkSync(LOG_FILE);
  console.log('Log file oauth cleared successfully!');
} else {
  console.log('Log file oauth does not exist.');
}