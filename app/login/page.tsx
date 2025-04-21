"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("johndoe123@gmail.com")
  const [password, setPassword] = useState("password123")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would authenticate with a server here
    if (email && password) {
      // Store user data
      const userData = {
        email: email,
        name: "John Doe",
        lastLogin: new Date().toISOString(),
      }

      // Save login state and user data
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userData", JSON.stringify(userData))

      // If remember me is checked, set a longer expiration
      if (rememberMe) {
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
        localStorage.setItem("loginExpiration", thirtyDaysFromNow.toISOString())
      }

      // Redirect to dashboard
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex w-full max-w-[1000px] h-[600px] shadow-lg rounded-lg overflow-hidden">
        <div className="flex-1 bg-primary text-white p-12 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Focus on what matters most</h2>
          <p className="mb-8 opacity-90">
            "Balance AI has completely revolutionized how I manage my time and tasks. I can't imagine going back to my
            old workflow."
          </p>
          <div className="flex-1 flex items-center justify-center">
            <img
              src="/modern-productivity-hub.png"
              alt="Productivity dashboard on laptop"
              className="max-w-full rounded-lg"
            />
          </div>
        </div>

        <div className="flex-1 bg-white p-12 flex items-center justify-center">
          <div className="w-full max-w-[400px]">
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground mb-8">Sign in to your account to continue</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-primary">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me for 30 days
                </Label>
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>

              <div className="text-center space-y-2 text-sm text-muted-foreground">
                <p>
                  Sign in with{" "}
                  <Link href="#" className="text-primary">
                    SSO
                  </Link>{" "}
                  or{" "}
                  <Link href="#" className="text-primary">
                    OAuth
                  </Link>
                </p>
                <p>
                  Don't have an account?{" "}
                  <Link href="#" className="text-primary">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
