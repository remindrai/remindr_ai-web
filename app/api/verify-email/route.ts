import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // In a real application, this would send an actual email
    // For this demo, we'll just simulate a successful email sending

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: `Verification email sent to ${email}`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to send verification email" }, { status: 500 })
  }
}
