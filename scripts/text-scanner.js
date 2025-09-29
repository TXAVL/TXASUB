#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Configuration
const COMPONENTS_DIR = 'components'
const OUTPUT_FILE = 'data/language/scan-results.json'
const VIETNAMESE_PATTERN = /[\u00C0-\u1EF9\u1EA0-\u1EF9]/g
const ENGLISH_PATTERN = /[A-Za-z]{3,}/g

// Text patterns to scan for
const TEXT_PATTERNS = [
  // JSX text content
  />\s*([^<>\n]+)\s*</g,
  // String literals in quotes
  /["']([^"']{3,})["']/g,
  // Template literals
  /`([^`]{3,})`/g,
  // JSX attributes
  /(title|placeholder|alt|aria-label)=["']([^"']+)["']/g
]

class TextScanner {
  constructor() {
    this.foundTexts = new Set()
    this.vietnameseTexts = new Set()
    this.englishTexts = new Set()
    this.componentFiles = []
  }

  // Scan all component files
  scanComponents() {
    const componentsPath = path.join(process.cwd(), COMPONENTS_DIR)
    
    if (!fs.existsSync(componentsPath)) {
      console.log(`Directory ${COMPONENTS_DIR} not found`)
      return
    }

    this.scanDirectory(componentsPath)
    this.analyzeTexts()
    this.generateReport()
  }

  // Recursively scan directory
  scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath)
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        this.scanDirectory(fullPath)
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        this.scanFile(fullPath)
      }
    }
  }

  // Scan individual file
  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const relativePath = path.relative(process.cwd(), filePath)
      
      // Skip files that already use translation system
      if (content.includes('useLanguage') || content.includes('translations:')) {
        return
      }

      const foundInFile = []
      
      // Extract text using patterns
      for (const pattern of TEXT_PATTERNS) {
        let match
        while ((match = pattern.exec(content)) !== null) {
          const text = match[1] || match[2] || match[0]
          if (this.isValidText(text)) {
            foundInFile.push({
              text: text.trim(),
              line: content.substring(0, match.index).split('\n').length,
              pattern: pattern.toString()
            })
            this.foundTexts.add(text.trim())
          }
        }
      }

      if (foundInFile.length > 0) {
        this.componentFiles.push({
          file: relativePath,
          texts: foundInFile
        })
      }
    } catch (error) {
      console.error(`Error scanning ${filePath}:`, error.message)
    }
  }

  // Check if text is valid for translation
  isValidText(text) {
    if (!text || text.length < 3) return false
    if (text.includes('{') || text.includes('}')) return false // Skip template strings
    if (text.includes('className') || text.includes('id=')) return false // Skip CSS
    if (text.includes('http') || text.includes('www.')) return false // Skip URLs
    if (/^[0-9\s\-\+\$\.]+$/.test(text)) return false // Skip numbers/currency
    if (text.includes('console.') || text.includes('import')) return false // Skip code
    return true
  }

  // Analyze found texts
  analyzeTexts() {
    for (const text of this.foundTexts) {
      if (VIETNAMESE_PATTERN.test(text)) {
        this.vietnameseTexts.add(text)
      } else if (ENGLISH_PATTERN.test(text)) {
        this.englishTexts.add(text)
      }
    }
  }

  // Generate report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: this.componentFiles.length,
        totalTexts: this.foundTexts.size,
        vietnameseTexts: this.vietnameseTexts.size,
        englishTexts: this.englishTexts.size
      },
      files: this.componentFiles,
      vietnameseTexts: Array.from(this.vietnameseTexts),
      englishTexts: Array.from(this.englishTexts),
      suggestedKeys: this.generateSuggestedKeys()
    }

    // Write report
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2))
    
    console.log('\n🔍 Text Scanner Results:')
    console.log(`📁 Files scanned: ${report.summary.totalFiles}`)
    console.log(`📝 Total texts found: ${report.summary.totalTexts}`)
    console.log(`🇻🇳 Vietnamese texts: ${report.summary.vietnameseTexts}`)
    console.log(`🇺🇸 English texts: ${report.summary.englishTexts}`)
    console.log(`📄 Report saved to: ${OUTPUT_FILE}`)
    
    // Show some examples
    if (report.vietnameseTexts.length > 0) {
      console.log('\n🇻🇳 Vietnamese texts found:')
      report.vietnameseTexts.slice(0, 5).forEach(text => console.log(`  - "${text}"`))
    }
    
    if (report.englishTexts.length > 0) {
      console.log('\n🇺🇸 English texts found:')
      report.englishTexts.slice(0, 5).forEach(text => console.log(`  - "${text}"`))
    }
  }

  // Generate suggested translation keys
  generateSuggestedKeys() {
    const keys = []
    
    // Vietnamese texts
    for (const text of this.vietnameseTexts) {
      const key = this.textToKey(text)
      keys.push({
        key,
        vietnamese: text,
        english: this.suggestEnglishTranslation(text)
      })
    }
    
    // English texts
    for (const text of this.englishTexts) {
      const key = this.textToKey(text)
      keys.push({
        key,
        vietnamese: this.suggestVietnameseTranslation(text),
        english: text
      })
    }
    
    return keys
  }

  // Convert text to key format
  textToKey(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 30)
  }

  // Suggest English translation
  suggestEnglishTranslation(vietnameseText) {
    const translations = {
      'Lịch hết hạn': 'Expiration Calendar',
      'Gói hết hạn ngày': 'Packages expiring on',
      'tháng': 'month',
      'năm': 'year',
      'Tự động gia hạn': 'Auto-renewal',
      'Gia hạn thủ công': 'Manual renewal',
      'Cần gia hạn thủ công': 'Needs manual renewal',
      'Gia hạn tiếp': 'Next renewal',
      'Hết hạn cuối': 'Final expiry',
      'Gia hạn vô thời hạn': 'Unlimited renewal'
    }
    
    return translations[vietnameseText] || vietnameseText
  }

  // Suggest Vietnamese translation
  suggestVietnameseTranslation(englishText) {
    const translations = {
      'Loading...': 'Đang tải...',
      'Made with': 'Được tạo bởi',
      'in Vietnam': 'tại Việt Nam',
      'Test Current Cookies': 'Kiểm tra Cookie hiện tại',
      'Test Manual Cookie': 'Kiểm tra Cookie thủ công',
      'Set Cookie Manually': 'Đặt Cookie thủ công',
      'Test Result': 'Kết quả kiểm tra',
      'No test results yet': 'Chưa có kết quả kiểm tra',
      'Steps': 'Các bước',
      'Click': 'Nhấp'
    }
    
    return translations[englishText] || englishText
  }
}

// Run scanner
const scanner = new TextScanner()
scanner.scanComponents()