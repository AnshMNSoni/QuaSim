"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Preloader } from "./preloader"
import { IntroVideo } from "@/components/intro-video"

interface LoadingWrapperProps {
  children: React.ReactNode
  delay?: number
  enableIntroVideo?: boolean
}

export default function LoadingWrapper({ children, delay = 1500, enableIntroVideo = true }: LoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [introComplete, setIntroComplete] = useState(false)

  useEffect(() => {
    // Only start the preloader timer after intro video is complete
    if (introComplete) {
      const timer = setTimeout(() => setIsLoading(false), delay)
      return () => clearTimeout(timer)
    }
  }, [delay, introComplete])

  const handleIntroComplete = () => {
    setIntroComplete(true)
  }

  // If intro video is enabled, wrap everything with IntroVideo
  if (enableIntroVideo) {
    return (
      <IntroVideo onComplete={handleIntroComplete}>
        <Preloader isLoading={introComplete && isLoading} />
        <div className={introComplete && !isLoading ? "opacity-100 transition-opacity duration-500" : "opacity-0"}>
          {children}
        </div>
      </IntroVideo>
    )
  }

  // Fallback to original behavior if intro video is disabled
  return (
    <>
      <Preloader isLoading={isLoading} />
      <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>{children}</div>
    </>
  )
}
