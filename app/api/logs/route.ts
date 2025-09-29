import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, unlink } from 'fs/promises'
import { join } from 'path'

const LOG_DIR = join(process.cwd(), 'logs')

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'debug'
    const limit = parseInt(searchParams.get('limit') || '100')
    
    const logFile = join(LOG_DIR, `${type}.log`)
    
    try {
      const content = await readFile(logFile, 'utf-8')
      const lines = content.split('\n').filter(line => line.trim())
      const recentLines = lines.slice(-limit)
      
      return NextResponse.json({
        success: true,
        logs: recentLines,
        total: lines.length,
        type
      })
    } catch (error) {
      return NextResponse.json({
        success: true,
        logs: [],
        total: 0,
        type
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to read logs'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'debug'
    
    const logFile = join(LOG_DIR, `${type}.log`)
    
    try {
      await unlink(logFile)
      return NextResponse.json({
        success: true,
        message: `${type} logs cleared`
      })
    } catch (error) {
      return NextResponse.json({
        success: true,
        message: 'Log file already empty or not found'
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to clear logs'
    }, { status: 500 })
  }
}