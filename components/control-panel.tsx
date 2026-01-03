"use client"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Trash2, Play, Loader2, Eye } from "lucide-react"

interface ControlPanelProps {
  onAddQubit: () => void
  onRemoveQubit: () => void
  onClearCircuit: () => void
  onSimulate: () => void
  onExportPNG: () => void
  isSimulating: boolean
  numQubits: number
  hasCircuit: boolean
}

export default function ControlPanel({
  onAddQubit,
  onRemoveQubit,
  onClearCircuit,
  onSimulate,
  onExportPNG,
  isSimulating,
  numQubits,
  hasCircuit,
}: ControlPanelProps) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Circuit Controls</h2>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddQubit}
            className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent"
          >
            <Plus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Add</span> Qubit
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRemoveQubit}
            disabled={numQubits <= 1}
            className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent"
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

        <Button
          variant="outline"
          size="sm"
          onClick={onExportPNG}
          disabled={!hasCircuit}
          className="text-xs sm:text-sm h-8 sm:h-9 bg-transparent"
          title={hasCircuit ? "Export simulation visualization as PNG" : "Run simulation first to export"}
        >
          <Eye className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          Export
        </Button>
      </div>
    </div>
  )
}
