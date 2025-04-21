import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Generate a random password
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    // In a real application, this would send an actual email with the password
    // For this demo, we'll just return the password (which would normally be a security risk)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: `Password generated and sent to ${email}`,
      password: password, // In a real app, you would NOT return this
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to generate and send password" }, { status: 500 })
  }
}
