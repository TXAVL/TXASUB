#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

class ClientDirectiveChecker {
  constructor() {
    this.issues = []
  }

  // Check all files for useLanguage without "use client"
  async checkAllFiles() {
    console.log('🔍 Checking for useLanguage without "use client" directive...')
    
    const componentsPath = path.join(process.cwd(), 'components')
    this.scanDirectory(componentsPath)
    
    this.generateReport()
  }

  // Recursively scan files
  scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath)
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        this.scanDirectory(fullPath)
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        this.checkFile(fullPath)
      }
    }
  }

  // Check individual file
  checkFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const relativePath = path.relative(process.cwd(), filePath)
      
      // Check if file uses useLanguage
      if (content.includes('useLanguage')) {
        // Check if file has "use client" directive
        const hasUseClient = content.includes('"use client"') || content.includes("'use client'")
        
        if (!hasUseClient) {
          this.issues.push({
            file: relativePath,
            issue: 'useLanguage without "use client" directive'
          })
          console.log(`❌ ${relativePath}: useLanguage without "use client"`)
        } else {
          console.log(`✅ ${relativePath}: useLanguage with "use client"`)
        }
      }
    } catch (error) {
      console.error(`❌ Error checking ${filePath}:`, error.message)
    }
  }

  // Generate report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: this.issues.length
      },
      issues: this.issues
    }

    fs.writeFileSync('data/language/client-directive-report.json', JSON.stringify(report, null, 2))
    
    console.log('\n📊 Client Directive Check Report:')
    console.log(`❌ Issues found: ${report.summary.totalIssues}`)
    console.log(`📄 Report saved to: data/language/client-directive-report.json`)
    
    if (this.issues.length > 0) {
      console.log('\n📝 Issues:')
      this.issues.forEach(issue => console.log(`  - ${issue.file}: ${issue.issue}`))
    }
  }
}

// Run checker
const checker = new ClientDirectiveChecker()
checker.checkAllFiles()