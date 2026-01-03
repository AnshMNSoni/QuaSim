"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"

interface IntroVideoProps {
  onComplete: () => void
  children: React.ReactNode
}

export function IntroVideo({ onComplete, children }: IntroVideoProps) {
  const [showVideo, setShowVideo] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasShownRef = useRef(false)

  useEffect(() => {
    setMounted(true)

    // Check if intro video has been shown before
    const introShown = localStorage.getItem("quasim-intro-shown")

    if (!introShown && !hasShownRef.current) {
      hasShownRef.current = true
      setShowVideo(true)
    } else {
      onComplete()
    }
  }, [onComplete])

  useEffect(() => {
    if (showVideo && videoRef.current && videoLoaded) {
      videoRef.current.play().catch((error) => {
        console.error("[v0] Intro video autoplay failed:", error)
        handleVideoEnd()
      })
    }
  }, [showVideo, videoLoaded])

  const handleVideoEnd = () => {
    localStorage.setItem("quasim-intro-shown", "true")

    setShowVideo(false)

    setTimeout(() => {
      onComplete()
    }, 500)
  }

  const handleVideoLoaded = () => {
    setVideoLoaded(true)
  }

  if (!mounted) {
    return null
  }

  if (!showVideo) {
    return <>{children}</>
  }

  const videoSrc = resolvedTheme === "dark" ? "/dark-intro.mp4" : "/light-intro.mp4"

  return (
    <>
      {/* Video overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-background flex items-center justify-center transition-opacity duration-500 ${
          showVideo && videoLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          onLoadedData={handleVideoLoaded}
          onEnded={handleVideoEnd}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Loading state while video loads */}
        {!videoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
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
        )}

        {/* Skip button */}
        {videoLoaded && (
          <button
            onClick={handleVideoEnd}
            className="absolute bottom-8 right-8 px-4 py-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg text-sm hover:bg-background/90 transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Hidden children (will be shown after video completes) */}
      <div className="opacity-0 pointer-events-none">{children}</div>
    </>
  )
}
