#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

class ToastFixer {
  constructor() {
    this.fixedFiles = []
    this.errors = []
  }

  // Fix all toastxa replacements
  async fixAllToastReplacements() {
    console.log('🔧 Starting toast replacement fix process...')
    
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

      // Fix toastxa back to toast
      if (content.includes('toastxa')) {
        updatedContent = updatedContent.replace(/toastxa\./g, 'toast.')
        hasChanges = true
      }

      // Fix other common replacements that might have been over-replaced
      const replacements = [
        // Fix common over-replacements
        { from: /txa\.success/g, to: 'toast.success' },
        { from: /txa\.error/g, to: 'toast.error' },
        { from: /txa\.warn/g, to: 'toast.warn' },
        { from: /txa\.info/g, to: 'toast.info' },
        // Fix other potential over-replacements
        { from: /txa\.loading/g, to: 'toast.loading' },
        { from: /txa\.clear/g, to: 'toast.clear' },
        { from: /txa\.dismiss/g, to: 'toast.dismiss' }
      ]

      for (const replacement of replacements) {
        if (replacement.from.test(updatedContent)) {
          updatedContent = updatedContent.replace(replacement.from, replacement.to)
          hasChanges = true
        }
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

    fs.writeFileSync('data/language/fix-toast-report.json', JSON.stringify(report, null, 2))
    
    console.log('\n📊 Toast Fix Report:')
    console.log(`✅ Files fixed: ${report.summary.totalFixed}`)
    console.log(`❌ Errors: ${report.summary.totalErrors}`)
    console.log(`📄 Report saved to: data/language/fix-toast-report.json`)
    
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
const fixer = new ToastFixer()
fixer.fixAllToastReplacements()