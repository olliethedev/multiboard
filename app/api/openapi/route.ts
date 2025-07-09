import { NextResponse } from 'next/server'
import openApiSpec from './openapi.json'

export async function GET() {
  try {
    return NextResponse.json(openApiSpec)
  } catch (error) {
    console.error('Error reading OpenAPI spec:', error)
    return NextResponse.json(
      { error: 'Failed to load OpenAPI specification' },
      { status: 500 }
    )
  }
} 