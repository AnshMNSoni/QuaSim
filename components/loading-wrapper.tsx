"use client"

import { useState, useEffect } from "react"
import { Preloader } from "./preloader"

interface LoadingWrapperProps {
  children: React.ReactNode
  delay?: number
}

export default function LoadingWrapper({ children, delay = 1500 }: LoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <>
      <Preloader isLoading={isLoading} />
      <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
        {children}
      </div>
    </>
  )
}
