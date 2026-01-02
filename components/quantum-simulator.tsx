"use client"

import type React from "react"
import { useState } from "react"
import CircuitBuilder from "./circuit-builder"
import VisualizationPanel from "./visualization-panel"
import TruthTable from "./truth-table"
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
import { Support } from "./support"
import { AIAssistant } from "./ai-assistant"
import { HighlightContext } from "@/lib/highlight-context"
import { Documentation } from "./documentation"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function QuantumSimulator() {
  const [circuit, setCircuit] = useState<QuantumCircuit>(new QuantumCircuit(2))
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [activeVisualization, setActiveVisualization] = useState<string>("circuit")
  const [isSimulating, setIsSimulating] = useState(false)
  const [userAction, setUserAction] = useState<string>("exploring the simulator")
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null)
  const [selectedMobileGate, setSelectedMobileGate] = useState<string | null>(null)
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false)
  const { toast } = useToast()

  const handleAddQubit = () => {
    setUserAction("adding a qubit to the circuit")
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

    setUserAction("removing a qubit from the circuit")
    const newCircuit = circuit.clone()
    newCircuit.removeQubit()
    setCircuit(newCircuit)
  }

  const handleAddGate = (gate: string, qubit: number, control?: number, step?: number) => {
    setUserAction(`adding a ${gate} gate to qubit ${qubit}`)
    const newCircuit = circuit.clone()

    if (qubit < 0 || qubit >= circuit.numQubits) {
      return
    }

    if (step !== undefined) {
      newCircuit.addGateAtStep(gate, qubit, step, control)
    } else {
      newCircuit.addGate(gate, qubit, control)
    }

    setCircuit(newCircuit)
    setSimulationResult(null)
  }

  const handleRemoveGate = (step: number, qubit: number) => {
    setUserAction("removing a gate from the circuit")
    const newCircuit = circuit.clone()
    newCircuit.removeGate(step, qubit)
    setCircuit(newCircuit)
    setSimulationResult(null)
  }

  const handleClearCircuit = () => {
    setUserAction("clearing the entire circuit")
    setCircuit(new QuantumCircuit(circuit.numQubits))
    setSimulationResult(null)
  }

  const handleSimulate = async () => {
    setUserAction("running a simulation")
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
    setUserAction("exporting the circuit")
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

    setUserAction("importing a circuit")
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
    <HighlightContext.Provider value={{ highlightedElement, highlightElement: setHighlightedElement }}>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen flex flex-col">
          <div className="container mx-auto px-4 py-6 flex-grow">
            <header className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1
                    className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
                    style={{ fontFamily: "var(--font-caveat)" }}
                  >
                    QuaSim
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsDocumentationOpen(true)}
                    className="rounded-full"
                    aria-label="Open documentation"
                  >
                    <BookOpen className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                  <GitHubLink />
                  <ThemeToggle />
                  <Support />
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Desktop gate selector */}
              <div
                id="gate-selector"
                className={`hidden lg:block lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg ${
                  highlightedElement === "gate-selector" ? "highlight-element" : ""
                }`}
              >
                <GateSelector
                  onSelectGate={handleAddGate}
                  circuit={circuit}
                  selectedMobileGate={selectedMobileGate}
                  onMobileGateSelect={setSelectedMobileGate}
                />
              </div>

              <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                {/* Control Panel */}
                <div
                  id="control-panel"
                  className={`bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg ${
                    highlightedElement === "control-panel" ? "highlight-element" : ""
                  }`}
                >
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

                {/* Circuit Builder */}
                <div
                  id="circuit-builder"
                  className={`bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg overflow-hidden ${
                    highlightedElement === "circuit-builder" ? "highlight-element" : ""
                  }`}
                >
                  <div className="overflow-x-auto -mx-3 sm:-mx-4 px-3 sm:px-4 pb-2">
                    <CircuitBuilder circuit={circuit} onAddGate={handleAddGate} onRemoveGate={handleRemoveGate} />
                  </div>
                </div>

                {simulationResult && (
                  <div
                    id="visualization-panel"
                    className={`bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg ${
                      highlightedElement === "visualization-panel" ? "highlight-element" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-3">
                      <h2 className="text-lg sm:text-xl font-semibold">Visualization</h2>
                      <div className="w-full sm:w-auto grid grid-cols-2 sm:flex gap-1 sm:gap-2">
                        <button
                          id="viz-circuit"
                          onClick={() => setActiveVisualization("circuit")}
                          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
                            activeVisualization === "circuit"
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                          } ${highlightedElement === "viz-circuit" ? "highlight-element" : ""}`}
                        >
                          Circuit
                        </button>
                        <button
                          id="viz-bloch"
                          onClick={() => setActiveVisualization("bloch")}
                          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
                            activeVisualization === "bloch"
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                          } ${highlightedElement === "viz-bloch" ? "highlight-element" : ""}`}
                        >
                          Bloch Sphere
                        </button>
                        <button
                          id="viz-histogram"
                          onClick={() => setActiveVisualization("histogram")}
                          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
                            activeVisualization === "histogram"
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                          } ${highlightedElement === "viz-histogram" ? "highlight-element" : ""}`}
                        >
                          Histogram
                        </button>
                        <button
                          id="viz-statevector"
                          onClick={() => setActiveVisualization("statevector")}
                          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
                            activeVisualization === "statevector"
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                          } ${highlightedElement === "viz-statevector" ? "highlight-element" : ""}`}
                        >
                          State Vector
                        </button>
                        <button
                          id="viz-truthtable"
                          onClick={() => setActiveVisualization("truthTable")}
                          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
                            activeVisualization === "truthTable"
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                          } ${highlightedElement === "viz-truthtable" ? "highlight-element" : ""}`}
                        >
                          Truth Table
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
                        {activeVisualization === "truthTable" &&
                          "Truth table of quantum states with probabilities, amplitudes, and phases"}
                      </div>

                      {activeVisualization === "truthTable" ? (
                        <TruthTable result={simulationResult} circuit={circuit} />
                      ) : (
                        <VisualizationPanel
                          result={simulationResult}
                          circuit={circuit}
                          activeVisualization={activeVisualization}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Footer />
          <AIAssistant
            circuit={circuit}
            activeVisualization={activeVisualization}
            userAction={userAction}
            onHighlightElement={setHighlightedElement}
          />
          <Documentation isOpen={isDocumentationOpen} onClose={() => setIsDocumentationOpen(false)} />
        </div>
      </DndProvider>
    </HighlightContext.Provider>
  )
}
