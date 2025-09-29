#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

class ReactxaFixer {
  constructor() {
    this.fixedFiles = []
    this.errors = []
  }

  // Fix all Reactxa replacements
  async fixAllReactxaReplacements() {
    console.log('🔧 Starting Reactxa replacement fix process...')
    
    const componentsPath = path.join(process.cwd(), 'components')
    this.scanDirectory(componentsPath)
    
    this.generateReport()
  }

  // Recursively scan and fix files
  scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath)
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        this.scanDirectory(fullPath)
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        this.fixFile(fullPath)
      }
    }
  }

  // Fix individual file
  fixFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const relativePath = path.relative(process.cwd(), filePath)
      
      let updatedContent = content
      let hasChanges = false

      // Fix Reactxa back to React
      if (content.includes('Reactxa.')) {
        updatedContent = updatedContent.replace(/Reactxa\./g, 'React.')
        hasChanges = true
      }

      if (hasChanges) {
        fs.writeFileSync(filePath, updatedContent)
        this.fixedFiles.push(relativePath)
        console.log(`✅ Fixed: ${relativePath}`)
      }
    } catch (error) {
      this.errors.push({ file: filePath, error: error.message })
      console.error(`❌ Error fixing ${filePath}:`, error.message)
    }
  }

  // Generate report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFixed: this.fixedFiles.length,
        totalErrors: this.errors.length
      },
      fixedFiles: this.fixedFiles,
      errors: this.errors
    }

    fs.writeFileSync('data/language/fix-reactxa-report.json', JSON.stringify(report, null, 2))
    
    console.log('\n📊 Reactxa Fix Report:')
    console.log(`✅ Files fixed: ${report.summary.totalFixed}`)
    console.log(`❌ Errors: ${report.summary.totalErrors}`)
    console.log(`📄 Report saved to: data/language/fix-reactxa-report.json`)
    
    if (this.fixedFiles.length > 0) {
      console.log('\n📝 Fixed files:')
      this.fixedFiles.forEach(file => console.log(`  - ${file}`))
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:')
      this.errors.forEach(error => console.log(`  - ${error.file}: ${error.error}`))
    }
  }
}

// Run fixer
const fixer = new ReactxaFixer()
fixer.fixAllReactxaReplacements()