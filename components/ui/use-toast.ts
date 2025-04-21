"use client"

// Simplified toast implementation
import { useState } from "react"

type ToastVariant = "default" | "destructive" | "success"

interface ToastProps {
  title?: string
  description?: string
  variant?: ToastVariant
}

// Simple global state for toasts
let toastCallback: ((toast: ToastProps) => void) | null = null

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    if (toastCallback) {
      toastCallback(props)
    } else {
      // Fallback to console if no toast component is mounted
      console.log(`Toast: ${props.title} - ${props.description}`)
    }
  }

  return { toast, toasts, setToasts }
}

// Export the toast function directly for easier imports
export const toast = (props: ToastProps) => {
  if (toastCallback) {
    toastCallback(props)
  } else {
    // Fallback to console if no toast component is mounted
    console.log(`Toast: ${props.title} - ${props.description}`)
  }
}

// Register a callback for the toast component
export function registerToastCallback(callback: (toast: ToastProps) => void) {
  toastCallback = callback
}
