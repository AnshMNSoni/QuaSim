"use client"

import { useState, useEffect } from "react"

export interface SimulationSettings {
  numShots: number
  precision: number
  enableAnimations: boolean
  enableParticleEffects: boolean
  autoSimulate: boolean
  showPhaseAngles: boolean
}

const DEFAULT_SETTINGS: SimulationSettings = {
  numShots: 1000,
  precision: 6,
  enableAnimations: true,
  enableParticleEffects: true,
  autoSimulate: false,
  showPhaseAngles: true,
}

export function useSettings() {
  const [settings, setSettings] = useState<SimulationSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedSettings = localStorage.getItem("quasim-settings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Failed to parse saved settings:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  const updateSettings = (newSettings: Partial<SimulationSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem("quasim-settings", JSON.stringify(updated))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.setItem("quasim-settings", JSON.stringify(DEFAULT_SETTINGS))
  }

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoaded,
  }
}
