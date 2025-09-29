import fs from 'fs/promises'
import path from 'path'

// Log levels
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

// Log interface
export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  source?: string
}

class Logger {
  private logDir: string
  private debugLogFile: string
  private errorLogFile: string

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs')
    this.debugLogFile = path.join(this.logDir, 'debug.log')
    this.errorLogFile = path.join(this.logDir, 'error.log')
    this.ensureLogDirectory()
  }

  private async ensureLogDirectory() {
    try {
      await fs.mkdir(this.logDir, { recursive: true })
    } catch (error) {
      console.error('Failed to create logs directory:', error)
    }
  }

  private formatLogEntry(entry: LogEntry): string {
    const timestamp = entry.timestamp
    const level = entry.level.padEnd(5)
    const source = entry.source ? `[${entry.source}]` : ''
    const data = entry.data ? `\nData: ${JSON.stringify(entry.data, null, 2)}` : ''
    
    return `[${timestamp}] ${level} ${source} ${entry.message}${data}`
  }

  private async writeToFile(filePath: string, content: string) {
    try {
      await fs.appendFile(filePath, content + '\n')
    } catch (error) {
      console.error('Failed to write to log file:', error)
    }
  }

  private shouldLogToConsole(level: LogLevel): boolean {
    // Log ERROR and FATAL to console, others to file only
    return level === LogLevel.ERROR || level === LogLevel.FATAL
  }

  private async log(level: LogLevel, message: string, data?: any, source?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      source
    }

    const formattedLog = this.formatLogEntry(entry)

    // Write to appropriate log file
    if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
      await this.writeToFile(this.errorLogFile, formattedLog)
    } else {
      await this.writeToFile(this.debugLogFile, formattedLog)
    }

    // Log to console if needed
    if (this.shouldLogToConsole(level)) {
      if (level === LogLevel.ERROR) {
        console.error(formattedLog)
      } else if (level === LogLevel.FATAL) {
        console.error('🚨 FATAL:', formattedLog)
      }
    }
  }

  // Public logging methods
  async debug(message: string, data?: any, source?: string) {
    await this.log(LogLevel.DEBUG, message, data, source)
  }

  async info(message: string, data?: any, source?: string) {
    await this.log(LogLevel.INFO, message, data, source)
  }

  async warn(message: string, data?: any, source?: string) {
    await this.log(LogLevel.WARN, message, data, source)
  }

  async error(message: string, data?: any, source?: string) {
    await this.log(LogLevel.ERROR, message, data, source)
  }

  async fatal(message: string, data?: any, source?: string) {
    await this.log(LogLevel.FATAL, message, data, source)
  }

  // Read logs
  async readDebugLogs(limit: number = 100): Promise<string[]> {
    try {
      const content = await fs.readFile(this.debugLogFile, 'utf8')
      const lines = content.split('\n').filter(line => line.trim())
      return lines.slice(-limit)
    } catch (error) {
      return []
    }
  }

  async readErrorLogs(limit: number = 100): Promise<string[]> {
    try {
      const content = await fs.readFile(this.errorLogFile, 'utf8')
      const lines = content.split('\n').filter(line => line.trim())
      return lines.slice(-limit)
    } catch (error) {
      return []
    }
  }

  // Clear logs
  async clearDebugLogs() {
    try {
      await fs.writeFile(this.debugLogFile, '')
    } catch (error) {
      console.error('Failed to clear debug logs:', error)
    }
  }

  async clearErrorLogs() {
    try {
      await fs.writeFile(this.errorLogFile, '')
    } catch (error) {
      console.error('Failed to clear error logs:', error)
    }
  }

  // Get log file info
  async getLogInfo() {
    try {
      const debugStats = await fs.stat(this.debugLogFile).catch(() => null)
      const errorStats = await fs.stat(this.errorLogFile).catch(() => null)
      
      return {
        debugLog: {
          exists: !!debugStats,
          size: debugStats?.size || 0,
          lastModified: debugStats?.mtime || null
        },
        errorLog: {
          exists: !!errorStats,
          size: errorStats?.size || 0,
          lastModified: errorStats?.mtime || null
        }
      }
    } catch (error) {
      return {
        debugLog: { exists: false, size: 0, lastModified: null },
        errorLog: { exists: false, size: 0, lastModified: null }
      }
    }
  }
}

// Export singleton instance
export const logger = new Logger()

// Convenience functions
export const logDebug = (message: string, data?: any, source?: string) => logger.debug(message, data, source)
export const logInfo = (message: string, data?: any, source?: string) => logger.info(message, data, source)
export const logWarn = (message: string, data?: any, source?: string) => logger.warn(message, data, source)
export const logError = (message: string, data?: any, source?: string) => logger.error(message, data, source)
export const logFatal = (message: string, data?: any, source?: string) => logger.fatal(message, data, source)