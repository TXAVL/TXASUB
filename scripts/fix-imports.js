#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

class ImportFixer {
  constructor() {
    this.fixedFiles = []
    this.errors = []
  }

  // Fix all import issues
  async fixAllImports() {
    console.log('🔧 Starting import fix process...')
    
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

      // Fix wrong imports where useLanguage is imported from wrong modules
      const wrongImportPatterns = [
        // Fix imports like: import { Card, CardContent, CardHeader, CardTitle , useLanguage } from "@/components/language-provider"
        /import\s*{\s*([^}]*),\s*useLanguage\s*}\s*from\s*["']@\/components\/language-provider["']/g,
        // Fix imports like: import { Button , useLanguage } from "@/components/language-provider"
        /import\s*{\s*([^}]*),\s*useLanguage\s*}\s*from\s*["']@\/components\/language-provider["']/g,
        // Fix imports like: import { Badge , useLanguage } from "@/components/language-provider"
        /import\s*{\s*([^}]*),\s*useLanguage\s*}\s*from\s*["']@\/components\/language-provider["']/g
      ]

      for (const pattern of wrongImportPatterns) {
        const matches = content.match(pattern)
        if (matches) {
          for (const match of matches) {
            // Extract the components (everything except useLanguage)
            const componentsMatch = match.match(/{\s*([^}]*),\s*useLanguage\s*}/)
            if (componentsMatch) {
              const components = componentsMatch[1].trim()
              
              // Determine the correct import path for these components
              const correctImportPath = this.getCorrectImportPath(components)
              
              // Replace the wrong import with correct ones
              const correctImport = `import { ${components} } from "${correctImportPath}"\nimport { useLanguage } from "@/components/language-provider"`
              
              updatedContent = updatedContent.replace(match, correctImport)
              hasChanges = true
            }
          }
        }
      }

      // Fix other common import issues
      if (content.includes('translations: t')) {
        updatedContent = updatedContent.replace(/translations:\s*t/g, 'txa')
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

  // Get correct import path for components
  getCorrectImportPath(components) {
    const componentList = components.split(',').map(c => c.trim())
    
    // UI components
    const uiComponents = ['Card', 'CardContent', 'CardHeader', 'CardTitle', 'Button', 'Badge', 'Input', 'Label', 'Textarea', 'Select', 'Dialog', 'Sheet', 'Sidebar', 'Breadcrumb', 'Pagination']
    
    // Check if any component is a UI component
    const hasUIComponents = componentList.some(comp => uiComponents.includes(comp))
    
    if (hasUIComponents) {
      // Determine the specific UI import path
      if (componentList.includes('Card') || componentList.includes('CardContent') || componentList.includes('CardHeader') || componentList.includes('CardTitle')) {
        return '@/components/ui/card'
      } else if (componentList.includes('Button')) {
        return '@/components/ui/button'
      } else if (componentList.includes('Badge')) {
        return '@/components/ui/badge'
      } else if (componentList.includes('Input') || componentList.includes('Label')) {
        return '@/components/ui/input'
      } else if (componentList.includes('Dialog')) {
        return '@/components/ui/dialog'
      } else if (componentList.includes('Sheet')) {
        return '@/components/ui/sheet'
      } else if (componentList.includes('Sidebar')) {
        return '@/components/ui/sidebar'
      } else if (componentList.includes('Breadcrumb')) {
        return '@/components/ui/breadcrumb'
      } else if (componentList.includes('Pagination')) {
        return '@/components/ui/pagination'
      } else {
        return '@/components/ui/button' // fallback
      }
    }
    
    return '@/components/ui/button' // fallback
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

    fs.writeFileSync('data/language/fix-imports-report.json', JSON.stringify(report, null, 2))
    
    console.log('\n📊 Import Fix Report:')
    console.log(`✅ Files fixed: ${report.summary.totalFixed}`)
    console.log(`❌ Errors: ${report.summary.totalErrors}`)
    console.log(`📄 Report saved to: data/language/fix-imports-report.json`)
    
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
const fixer = new ImportFixer()
fixer.fixAllImports()