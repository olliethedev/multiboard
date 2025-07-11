import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const openAPISchema = await auth.api.generateOpenAPISchema()


export async function GET() {
    try {
      return NextResponse.json(openAPISchema)
    } catch (error) {
      console.error('Error reading OpenAPI spec:', error)
      return NextResponse.json(
        { error: 'Failed to load OpenAPI specification' },
        { status: 500 }
      )
    }
  } 