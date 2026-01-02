"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocumentationProps {
  isOpen: boolean
  onClose: () => void
}

export function Documentation({ isOpen, onClose }: DocumentationProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-xl sm:text-2xl font-bold">Documentation</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close documentation">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Getting Started */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Getting Started</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              QuaSim is a web-based quantum circuit simulator that allows you to build, visualize, and simulate quantum
              circuits interactively.
            </p>
            <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
              <li>Start by adding qubits using the "Add Qubit" button in the Control Panel</li>
              <li>Select a quantum gate from the gate panel on the left (desktop) or below the controls (mobile)</li>
              <li>Place the gate on the circuit by dragging and dropping (desktop) or tapping (mobile)</li>
              <li>Click "Simulate" to run your circuit and view the results</li>
            </ol>
          </section>

          {/* Gate Placement */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Gate Placement</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-1">Desktop:</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Drag gates from the left panel and drop them onto the circuit grid. Gates automatically align to
                  available positions on qubit lines.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Mobile:</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Tap a gate to select it (it will be highlighted), then tap on the circuit grid where you want to place
                  it. For multi-qubit gates, tap on the control qubit first.
                </p>
              </div>
            </div>
          </section>

          {/* Simulation Flow */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Simulation Flow</h3>
            <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
              <li>Build your quantum circuit by adding gates and operations</li>
              <li>Click the "Simulate" button to execute the circuit</li>
              <li>
                View results in different visualization modes: Circuit, Bloch Sphere, Histogram, State Vector, or Truth
                Table
              </li>
              <li>Analyze the quantum state and measurement probabilities</li>
            </ol>
          </section>

          {/* Quantum Gates and Their Uses */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Quantum Gates and Their Uses</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Single-Qubit Gates</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700 dark:text-gray-300">
                  <div>
                    <span className="font-semibold">H (Hadamard)</span>: Creates superposition
                  </div>
                  <div>
                    <span className="font-semibold">X, Y, Z</span>: Pauli gates (bit/phase flips)
                  </div>
                  <div>
                    <span className="font-semibold">S, T</span>: Phase gates
                  </div>
                  <div>
                    <span className="font-semibold">RX, RY, RZ</span>: Rotation gates
                  </div>
                  <div>
                    <span className="font-semibold">U, U3</span>: Universal single-qubit gates
                  </div>
                  <div>
                    <span className="font-semibold">I (Identity)</span>: No operation
                  </div>
                  <div>
                    <span className="font-semibold">SX</span>: Square root of X gate
                  </div>
                  <div>
                    <span className="font-semibold">P (Phase)</span>: Adds phase to |1⟩
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Multi-Qubit Gates</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700 dark:text-gray-300">
                  <div>
                    <span className="font-semibold">CNOT (CX)</span>: Controlled-X gate
                  </div>
                  <div>
                    <span className="font-semibold">CY, CZ</span>: Controlled Y and Z
                  </div>
                  <div>
                    <span className="font-semibold">CRX, CRY, CRZ</span>: Controlled rotations
                  </div>
                  <div>
                    <span className="font-semibold">CU</span>: Controlled universal gate
                  </div>
                  <div>
                    <span className="font-semibold">CCX (Toffoli)</span>: Controlled-controlled-X
                  </div>
                  <div>
                    <span className="font-semibold">CS, CT</span>: Controlled S and T gates
                  </div>
                  <div>
                    <span className="font-semibold">SWAP</span>: Swaps two qubits
                  </div>
                  <div>
                    <span className="font-semibold">iSWAP</span>: Interaction SWAP
                  </div>
                  <div>
                    <span className="font-semibold">Fredkin (CSWAP)</span>: Controlled SWAP
                  </div>
                  <div>
                    <span className="font-semibold">RXX, RYY, RZZ</span>: Two-qubit rotations
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Special Operations</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700 dark:text-gray-300">
                  <div>
                    <span className="font-semibold">M (Measure)</span>: Measure qubit in Z basis
                  </div>
                  <div>
                    <span className="font-semibold">Barrier</span>: Visual/compilation barrier
                  </div>
                  <div>
                    <span className="font-semibold">Reset</span>: Reset qubit to |0⟩
                  </div>
                  <div>
                    <span className="font-semibold">Delay</span>: Add timing delay
                  </div>
                  <div>
                    <span className="font-semibold">Initialize</span>: Prepare specific state
                  </div>
                  <div>
                    <span className="font-semibold">XX, YY, ZZ</span>: Two-qubit Pauli gates
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tips and Tricks */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Tips and Tricks</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>Use the "Clear Circuit" button to start fresh</li>
              <li>Export your circuits as JSON and import them later</li>
              <li>Hover over visualizations to see detailed state information</li>
              <li>Multi-qubit gates show control (●) and target (⊕) connections</li>
              <li>The Bloch sphere visualization is available after simulation</li>
              <li>Check the truth table for detailed measurement probabilities</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
