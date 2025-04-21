"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { registerToastCallback } from "./use-toast"

type ToastVariant = "default" | "destructive" | "success"

interface ToastProps {
  title?: string
  description?: string
  variant?: ToastVariant
}

export function Toast({ title, description, variant = "default" }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  const variantClasses = {
    default: "bg-white border-gray-200",
    destructive: "bg-red-50 border-red-200",
    success: "bg-green-50 border-green-200",
  }

  const titleClasses = {
    default: "text-gray-900",
    destructive: "text-red-900",
    success: "text-green-900",
  }

  const descriptionClasses = {
    default: "text-gray-500",
    destructive: "text-red-700",
    success: "text-green-700",
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-md rounded-lg border p-4 shadow-md ${variantClasses[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          {title && <h3 className={`font-medium ${titleClasses[variant]}`}>{title}</h3>}
          {description && <p className={`mt-1 text-sm ${descriptionClasses[variant]}`}>{description}</p>}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  useEffect(() => {
    registerToastCallback((toast) => {
      setToasts((prev) => [...prev, toast])

      // Remove toast after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t !== toast))
      }, 5000)
    })
  }, [])

  return (
    <>
      {toasts.map((toast, index) => (
        <Toast key={index} {...toast} />
      ))}
    </>
  )
}
