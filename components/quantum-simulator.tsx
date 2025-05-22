"use client"

import type React from "react"

import { useState } from "react"
import CircuitBuilder from "./circuit-builder"
import VisualizationPanel from "./visualization-panel"
import GateSelector from "./gate-selector"
import ControlPanel from "./control-panel"
import { QuantumCircuit } from "@/lib/quantum-circuit"
import type { SimulationResult } from "@/lib/types"
import { simulateCircuit } from "@/lib/simulator"
import { useToast } from "@/components/ui/use-toast"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ThemeToggle } from "./theme-toggle"
import { GitHubLink } from "./github-link"
import { Footer } from "./footer"

export default function QuantumSimulator() {
  const [circuit, setCircuit] = useState<QuantumCircuit>(new QuantumCircuit(2))
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [activeVisualization, setActiveVisualization] = useState<string>("circuit")
  const [isSimulating, setIsSimulating] = useState(false)
  const { toast } = useToast()

  const handleAddQubit = () => {
    const newCircuit = circuit.clone()
    newCircuit.addQubit()
    setCircuit(newCircuit)
  }

  const handleRemoveQubit = () => {
    if (circuit.numQubits <= 1) {
      toast({
        title: "Cannot remove qubit",
        description: "Circuit must have at least one qubit",
        variant: "destructive",
      })
      return
    }

    const newCircuit = circuit.clone()
    newCircuit.removeQubit()
    setCircuit(newCircuit)
  }

  const handleAddGate = (gate: string, qubit: number, control?: number, step?: number) => {
    const newCircuit = circuit.clone()

    // For mobile selection, we might not have a valid qubit yet
    if (qubit < 0 || qubit >= circuit.numQubits) {
      // This is likely a mobile gate selection, store it for later placement
      // We'll handle this in the CircuitBuilder component
      return
    }

    // Add the gate to the circuit at the specific step if provided
    if (step !== undefined) {
      newCircuit.addGateAtStep(gate, qubit, step, control)
    } else {
      newCircuit.addGate(gate, qubit, control)
    }

    setCircuit(newCircuit)
    setSimulationResult(null) // Clear previous simulation results
  }

  const handleRemoveGate = (step: number, qubit: number) => {
    const newCircuit = circuit.clone()
    newCircuit.removeGate(step, qubit)
    setCircuit(newCircuit)
    setSimulationResult(null) // Clear previous simulation results
  }

  const handleClearCircuit = () => {
    setCircuit(new QuantumCircuit(circuit.numQubits))
    setSimulationResult(null)
  }

  const handleSimulate = async () => {
    setIsSimulating(true)
    try {
      const result = await simulateCircuit(circuit)
      setSimulationResult(result)
    } catch (error) {
      toast({
        title: "Simulation Error",
        description: error instanceof Error ? error.message : "An error occurred during simulation",
        variant: "destructive",
      })
    } finally {
      setIsSimulating(false)
    }
  }

  const handleExportCircuit = () => {
    const circuitData = circuit.serialize()
    const blob = new Blob([JSON.stringify(circuitData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "quantum-circuit.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportCircuit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const circuitData = JSON.parse(e.target?.result as string)
        const newCircuit = QuantumCircuit.deserialize(circuitData)
        setCircuit(newCircuit)
        setSimulationResult(null)
        toast({
          title: "Circuit Imported",
          description: "The circuit has been successfully imported",
        })
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to import circuit. The file may be corrupted.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-6 flex-grow">
          <header className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  QuaSim
                </h1>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Quantum Circuit Simulator</p>
              </div>
              <div className="flex items-center gap-2">
                <GitHubLink />
                <ThemeToggle />
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center">
              Build, visualize, and simulate quantum circuits with an interactive interface
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg">
              <GateSelector onSelectGate={handleAddGate} circuit={circuit} />
            </div>

            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg">
                <ControlPanel
                  onAddQubit={handleAddQubit}
                  onRemoveQubit={handleRemoveQubit}
                  onClearCircuit={handleClearCircuit}
                  onSimulate={handleSimulate}
                  onExportCircuit={handleExportCircuit}
                  onImportCircuit={handleImportCircuit}
                  isSimulating={isSimulating}
                  numQubits={circuit.numQubits}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg overflow-hidden">
                <div className="overflow-x-auto -mx-3 sm:-mx-4 px-3 sm:px-4 pb-2">
                  <CircuitBuilder circuit={circuit} onAddGate={handleAddGate} onRemoveGate={handleRemoveGate} />
                </div>
              </div>

              {simulationResult && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Visualization</h2>
                    <div className="w-full sm:w-auto grid grid-cols-2 sm:flex gap-1 sm:gap-2">
                      <button
                        onClick={() => setActiveVisualization("circuit")}
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
                          activeVisualization === "circuit"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                        title="View the quantum circuit diagram"
                      >
                        Circuit
                      </button>
                      <button
                        onClick={() => setActiveVisualization("bloch")}
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
                          activeVisualization === "bloch"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                        title="View qubit states on Bloch spheres"
                      >
                        Bloch Sphere
                      </button>
                      <button
                        onClick={() => setActiveVisualization("histogram")}
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
                          activeVisualization === "histogram"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                        title="View measurement probability distribution"
                      >
                        Histogram
                      </button>
                      <button
                        onClick={() => setActiveVisualization("statevector")}
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
                          activeVisualization === "statevector"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                        title="View quantum state vector amplitudes"
                      >
                        State Vector
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-2 sm:p-3 overflow-hidden">
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {activeVisualization === "circuit" && "Circuit diagram showing quantum operations in sequence"}
                      {activeVisualization === "bloch" && "Bloch sphere representation of each qubit's state"}
                      {activeVisualization === "histogram" &&
                        "Probability distribution of possible measurement outcomes"}
                      {activeVisualization === "statevector" &&
                        "Amplitude and phase of each basis state in the quantum state vector"}
                    </div>
                    <VisualizationPanel
                      result={simulationResult}
                      circuit={circuit}
                      activeVisualization={activeVisualization}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </DndProvider>
  )
}
