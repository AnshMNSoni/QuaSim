"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Plus, Minus, Trash2, Play, Download, Upload, Loader2 } from "lucide-react"

interface ControlPanelProps {
  onAddQubit: () => void
  onRemoveQubit: () => void
  onClearCircuit: () => void
  onSimulate: () => void
  onExportCircuit: () => void
  onImportCircuit: (event: React.ChangeEvent<HTMLInputElement>) => void
  isSimulating: boolean
  numQubits: number
}

export default function ControlPanel({
  onAddQubit,
  onRemoveQubit,
  onClearCircuit,
  onSimulate,
  onExportCircuit,
  onImportCircuit,
  isSimulating,
  numQubits,
}: ControlPanelProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Circuit Controls</h2>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onAddQubit} className="text-xs sm:text-sm h-8 sm:h-9">
            <Plus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Add</span> Qubit
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRemoveQubit}
            disabled={numQubits <= 1}
            className="text-xs sm:text-sm h-8 sm:h-9"
          >
            <Minus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Remove</span> Qubit
          </Button>
        </div>

        <Button variant="destructive" size="sm" onClick={onClearCircuit} className="text-xs sm:text-sm h-8 sm:h-9">
          <Trash2 className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Clear</span> Circuit
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onSimulate}
          disabled={isSimulating}
          className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm h-8 sm:h-9"
        >
          {isSimulating ? (
            <Loader2 className="mr-1 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
          ) : (
            <Play className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          )}
          Simulate
        </Button>

        <Button variant="outline" size="sm" onClick={onExportCircuit} className="text-xs sm:text-sm h-8 sm:h-9">
          <Download className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Export</span>
        </Button>

        <Button variant="outline" size="sm" onClick={handleImportClick} className="text-xs sm:text-sm h-8 sm:h-9">
          <Upload className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Import</span>
          <input type="file" ref={fileInputRef} onChange={onImportCircuit} accept=".json" className="hidden" />
        </Button>
      </div>
    </div>
  )
}
