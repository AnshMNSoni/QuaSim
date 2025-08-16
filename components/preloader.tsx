"use client"

import { useEffect, useState } from "react"

interface PreloaderProps {
  isLoading?: boolean
  className?: string
}

export function Preloader({ isLoading = true, className = "" }: PreloaderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isLoading) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm ${className}`}
    >
      <div className="relative">
        {/* Quantum Circuit Inspired Animation */}
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          {/* Outer rotating ring */}
          <div
            className="absolute inset-0 border-2 border-primary/30 rounded-full animate-spin"
            style={{ animationDuration: "3s" }}
          />

          {/* Middle pulsing ring */}
          <div className="absolute inset-2 border-2 border-primary/60 rounded-full animate-pulse" />

          {/* Inner quantum dots */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              {/* Central quantum state */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full animate-pulse" />

              {/* Orbiting quantum particles */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s" }}>
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 -translate-x-1/2 bg-blue-500 rounded-full" />
                <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 -translate-x-1/2 bg-green-500 rounded-full" />
              </div>

              <div
                className="absolute inset-0 animate-spin"
                style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
              >
                <div className="absolute left-0 top-1/2 w-1.5 h-1.5 -translate-y-1/2 bg-red-500 rounded-full" />
                <div className="absolute right-0 top-1/2 w-1.5 h-1.5 -translate-y-1/2 bg-purple-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Quantum wave effect */}
          <div
            className="absolute inset-0 rounded-full border border-primary/20 animate-ping"
            style={{ animationDuration: "2s" }}
          />
        </div>
      </div>
    </div>
  )
}
