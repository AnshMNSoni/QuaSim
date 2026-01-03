"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Moon, Sun, Monitor, Zap, RotateCcw, Save, Info } from "lucide-react"
import Link from "next/link"

interface SimulationSettings {
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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<SimulationSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    setMounted(true)
    const savedSettings = localStorage.getItem("quasim-settings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Failed to parse saved settings:", error)
      }
    }
  }, [])

  const saveSettings = () => {
    localStorage.setItem("quasim-settings", JSON.stringify(settings))
    toast({
      title: "Settings saved",
      description: "Your preferences have been saved successfully.",
    })
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.setItem("quasim-settings", JSON.stringify(DEFAULT_SETTINGS))
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values.",
    })
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all saved circuits and data? This action cannot be undone.")) {
      const introShown = localStorage.getItem("quasim-intro-shown")
      localStorage.clear()
      if (introShown) {
        localStorage.setItem("quasim-intro-shown", introShown)
      }
      setSettings(DEFAULT_SETTINGS)
      toast({
        title: "Data cleared",
        description: "All saved data has been removed.",
        variant: "destructive",
      })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Customize your QuaSim experience</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the visual theme of the simulator</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Animations</Label>
                  <p className="text-sm text-gray-500">Smooth transitions and visual effects</p>
                </div>
                <Switch
                  checked={settings.enableAnimations}
                  onCheckedChange={(checked) => {
                    setSettings({ ...settings, enableAnimations: checked })
                    saveSettings()
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Particle Effects</Label>
                  <p className="text-sm text-gray-500">Visual particle effects in visualizations</p>
                </div>
                <Switch
                  checked={settings.enableParticleEffects}
                  onCheckedChange={(checked) => {
                    setSettings({ ...settings, enableParticleEffects: checked })
                    saveSettings()
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Simulation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Simulation
              </CardTitle>
              <CardDescription>Configure simulation behavior and accuracy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Number of Shots</Label>
                  <span className="text-sm text-gray-500">{settings.numShots}</span>
                </div>
                <Slider
                  value={[settings.numShots]}
                  onValueChange={([value]) => setSettings({ ...settings, numShots: value })}
                  min={100}
                  max={10000}
                  step={100}
                  className="w-full"
                />
                <div className="flex items-start gap-2 text-xs text-gray-500 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <p>Note: QuaSim uses state vector simulation for exact results. This setting is reserved for future shot-based simulation modes.</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Decimal Precision</Label>
                  <span className="text-sm text-gray-500">{settings.precision} digits</span>
                </div>
                <Slider
                  value={[settings.precision]}
                  onValueChange={([value]) => {
                    setSettings({ ...settings, precision: value })
                    saveSettings()
                  }}
                  min={2}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Number of decimal places for displaying amplitudes and probabilities
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Simulate</Label>
                  <p className="text-sm text-gray-500">Automatically run simulation when circuit changes</p>
                </div>
                <Switch
                  checked={settings.autoSimulate}
                  onCheckedChange={(checked) => {
                    setSettings({ ...settings, autoSimulate: checked })
                    saveSettings()
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Phase Angles</Label>
                  <p className="text-sm text-gray-500">Display phase information in state vectors</p>
                </div>
                <Switch
                  checked={settings.showPhaseAngles}
                  onCheckedChange={(checked) => {
                    setSettings({ ...settings, showPhaseAngles: checked })
                    saveSettings()
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Manage your saved data and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button onClick={saveSettings} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
                <Button onClick={resetSettings} variant="outline" className="flex-1 bg-transparent">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-red-600 dark:text-red-400">Danger Zone</Label>
                <Button onClick={clearAllData} variant="destructive" className="w-full">
                  Clear All Data
                </Button>
                <p className="text-xs text-gray-500">
                  This will remove all saved circuits, settings, and cached data. This action cannot be undone.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About QuaSim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>QuaSim</strong> is an interactive quantum circuit simulator designed to help students and
                developers learn quantum computing through visualization and experimentation.
              </p>
              <p className="text-purple-600 hover:bg-purple-700">Version 0.2.0</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
