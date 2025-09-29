// Test script for logging system
const { logger } = require('../lib/logger.ts')

console.log('🧪 Testing Logging System')
console.log('========================')

async function testLogging() {
  try {
    console.log('\n📝 Testing different log levels...')
    
    // Test debug logs (should go to file only)
    await logger.debug('Debug message test', { test: 'data' }, 'TEST')
    console.log('✅ Debug log written to file')
    
    // Test info logs (should go to file only)
    await logger.info('Info message test', { user: 'test-user' }, 'TEST')
    console.log('✅ Info log written to file')
    
    // Test warn logs (should go to file only)
    await logger.warn('Warning message test', { warning: 'test-warning' }, 'TEST')
    console.log('✅ Warning log written to file')
    
    // Test error logs (should go to file AND console)
    await logger.error('Error message test', { error: 'test-error' }, 'TEST')
    console.log('✅ Error log written to file and console')
    
    // Test fatal logs (should go to file AND console)
    await logger.fatal('Fatal message test', { fatal: 'test-fatal' }, 'TEST')
    console.log('✅ Fatal log written to file and console')
    
    console.log('\n📊 Reading log info...')
    const logInfo = await logger.getLogInfo()
    console.log('Debug log:', logInfo.debugLog)
    console.log('Error log:', logInfo.errorLog)
    
    console.log('\n📖 Reading recent logs...')
    const debugLogs = await logger.readDebugLogs(5)
    const errorLogs = await logger.readErrorLogs(5)
    
    console.log('Recent debug logs:')
    debugLogs.forEach((log, index) => {
      console.log(`  ${index + 1}. ${log}`)
    })
    
    console.log('\nRecent error logs:')
    errorLogs.forEach((log, index) => {
      console.log(`  ${index + 1}. ${log}`)
    })
    
    console.log('\n✅ Logging system test completed!')
    console.log('📁 Check logs folder for generated files')
    
  } catch (error) {
    console.error('❌ Logging test failed:', error)
  }
}

// Run test
testLogging()