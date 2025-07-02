import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Log the received data
    console.log('Received form data:', data)

    // Simulate a successful response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      receivedData: data,
    })
  } catch (error) {
    console.error('Error in test-form API route:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process form submission' },
      { status: 500 }
    )
  }
}
