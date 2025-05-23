import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json()
    const domain = body.domain

    if (!domain.domain) return

    const response = await fetch(`https://${domain.domain}`, { method: 'HEAD' })
    return NextResponse.json(
      { ...domain, status: response.ok ? 'up' : 'down' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 'down', message: (error as Error).message },
      { status: 500 }
    )
  }
}
