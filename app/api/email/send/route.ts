import { sendBusinessRecordEmail } from '@/lib/email-utils'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { record, toEmail } = await request.json()

    if (!record || !toEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const success = await sendBusinessRecordEmail(record, toEmail)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in email API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
