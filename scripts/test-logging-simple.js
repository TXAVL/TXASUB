// Simple test script for logging system
const fs = require('fs')
const path = require('path')

console.log('🧪 Testing Logging System')
console.log('========================')

async function testLogging() {
  try {
    const logsDir = path.join(process.cwd(), 'logs')
    const debugLogFile = path.join(logsDir, 'debug.log')
    const errorLogFile = path.join(logsDir, 'error.log')
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
      console.log('✅ Created logs directory')
    }
    
    // Test writing to debug log
    const debugMessage = `[${new Date().toISOString()}] DEBUG [TEST] Test debug message\n`
    fs.appendFileSync(debugLogFile, debugMessage)
    console.log('✅ Debug log written')
    
    // Test writing to error log
    const errorMessage = `[${new Date().toISOString()}] ERROR [TEST] Test error message\n`
    fs.appendFileSync(errorLogFile, errorMessage)
    console.log('✅ Error log written')
    
    // Check log files
    const debugExists = fs.existsSync(debugLogFile)
    const errorExists = fs.existsSync(errorLogFile)
    
    console.log('\n📊 Log Files Status:')
    console.log(`Debug log exists: ${debugExists}`)
    console.log(`Error log exists: ${errorExists}`)
    
    if (debugExists) {
      const debugStats = fs.statSync(debugLogFile)
      console.log(`Debug log size: ${debugStats.size} bytes`)
    }
    
    if (errorExists) {
      const errorStats = fs.statSync(errorLogFile)
      console.log(`Error log size: ${errorStats.size} bytes`)
    }
    
    console.log('\n✅ Logging system test completed!')
    console.log('📁 Check logs folder for generated files')
    console.log('🌐 Visit /profile and go to Log Manager tab to view logs')
    
  } catch (error) {
    console.error('❌ Logging test failed:', error)
  }
}

// Run test
testLogging()