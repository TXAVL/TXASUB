#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Configuration
const COMPONENTS_DIR = 'components'
const BACKUP_DIR = 'backup'

class TranslationUpdater {
  constructor() {
    this.updatedFiles = []
    this.errors = []
  }

  // Main update process
  async updateAllComponents() {
    console.log('🚀 Starting translation update process...')
    
    // Create backup
    await this.createBackup()
    
    // Update all component files
    await this.updateComponents()
    
    // Generate report
    this.generateReport()
  }

  // Create backup of original files
  async createBackup() {
    const backupPath = path.join(process.cwd(), BACKUP_DIR)
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true })
    }
    console.log('📦 Backup created')
  }

  // Update all components
  async updateComponents() {
    const componentsPath = path.join(process.cwd(), COMPONENTS_DIR)
    this.scanDirectory(componentsPath)
  }

  // Recursively scan and update files
  scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath)
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        this.scanDirectory(fullPath)
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        this.updateFile(fullPath)
      }
    }
  }

  // Update individual file
  updateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const relativePath = path.relative(process.cwd(), filePath)
      
      // Skip if already updated or doesn't need translation
      if (content.includes('txa.') || !this.needsTranslation(content)) {
        return
      }

      let updatedContent = content
      let hasChanges = false

      // Update useLanguage hook
      if (content.includes('useLanguage')) {
        updatedContent = updatedContent.replace(
          /const\s*{\s*translations:\s*t\s*}\s*=\s*useLanguage\(\)/g,
          'const { txa } = useLanguage()'
        )
        hasChanges = true
      }

      // Update t. to txa.
      if (content.includes('t.')) {
        updatedContent = updatedContent.replace(/t\./g, 'txa.')
        hasChanges = true
      }

      // Add useLanguage import if missing
      if (this.hasHardcodedText(content) && !content.includes('useLanguage')) {
        updatedContent = this.addLanguageImport(updatedContent)
        hasChanges = true
      }

      // Add useLanguage hook if missing
      if (this.hasHardcodedText(content) && !content.includes('useLanguage()')) {
        updatedContent = this.addLanguageHook(updatedContent)
        hasChanges = true
      }

      if (hasChanges) {
        // Create backup
        const backupPath = path.join(process.cwd(), BACKUP_DIR, path.basename(filePath))
        fs.writeFileSync(backupPath, content)
        
        // Write updated content
        fs.writeFileSync(filePath, updatedContent)
        
        this.updatedFiles.push(relativePath)
        console.log(`✅ Updated: ${relativePath}`)
      }
    } catch (error) {
      this.errors.push({ file: filePath, error: error.message })
      console.error(`❌ Error updating ${filePath}:`, error.message)
    }
  }

  // Check if file needs translation
  needsTranslation(content) {
    const vietnamesePattern = /[\u00C0-\u1EF9\u1EA0-\u1EF9]/
    const englishPattern = /[A-Za-z]{3,}/
    
    return vietnamesePattern.test(content) || 
           (englishPattern.test(content) && this.hasUserFacingText(content))
  }

  // Check if content has user-facing text
  hasUserFacingText(content) {
    const userFacingPatterns = [
      /className="[^"]*">[^<]*[A-Za-z\u00C0-\u1EF9]{3,}/,
      /placeholder="[^"]*"/,
      /title="[^"]*"/,
      /aria-label="[^"]*"/
    ]
    
    return userFacingPatterns.some(pattern => pattern.test(content))
  }

  // Check for hardcoded text
  hasHardcodedText(content) {
    const hardcodedPatterns = [
      /"[^"]*[\u00C0-\u1EF9\u1EA0-\u1EF9][^"]*"/,
      /'[^']*[\u00C0-\u1EF9\u1EA0-\u1EF9][^']*'/,
      />\s*[A-Za-z\u00C0-\u1EF9\u1EA0-\u1EF9]{3,}\s*</
    ]
    
    return hardcodedPatterns.some(pattern => pattern.test(content))
  }

  // Add useLanguage import
  addLanguageImport(content) {
    const importMatch = content.match(/import\s*{\s*[^}]*\s*}\s*from\s*["']@\/components\/[^"']*["']/)
    if (importMatch) {
      const importLine = importMatch[0]
      const newImportLine = importLine.replace(
        /}\s*from\s*["']@\/components\/[^"']*["']/,
        ', useLanguage } from "@/components/language-provider"'
      )
      return content.replace(importLine, newImportLine)
    } else {
      // Add new import
      const newImport = 'import { useLanguage } from "@/components/language-provider"\n'
      return newImport + content
    }
  }

  // Add useLanguage hook
  addLanguageHook(content) {
    const functionMatch = content.match(/export\s+function\s+\w+\s*\([^)]*\)\s*{/)
    if (functionMatch) {
      const functionLine = functionMatch[0]
      const newFunctionLine = functionLine + '\n  const { txa } = useLanguage()'
      return content.replace(functionLine, newFunctionLine)
    }
    return content
  }

  // Generate report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalUpdated: this.updatedFiles.length,
        totalErrors: this.errors.length
      },
      updatedFiles: this.updatedFiles,
      errors: this.errors
    }

    fs.writeFileSync('data/language/update-report.json', JSON.stringify(report, null, 2))
    
    console.log('\n📊 Update Report:')
    console.log(`✅ Files updated: ${report.summary.totalUpdated}`)
    console.log(`❌ Errors: ${report.summary.totalErrors}`)
    console.log(`📄 Report saved to: data/language/update-report.json`)
    
    if (this.updatedFiles.length > 0) {
      console.log('\n📝 Updated files:')
      this.updatedFiles.forEach(file => console.log(`  - ${file}`))
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:')
      this.errors.forEach(error => console.log(`  - ${error.file}: ${error.error}`))
    }
  }
}

// Run updater
const updater = new TranslationUpdater()
updater.updateAllComponents()