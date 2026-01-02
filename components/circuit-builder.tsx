"use client"

import { useState, useEffect } from "react"
import type { QuantumCircuit } from "@/lib/quantum-circuit"
import { useDrop } from "react-dnd"
import { X } from "lucide-react"

interface CircuitBuilderProps {
  circuit: QuantumCircuit
  onAddGate: (gate: string, qubit: number, control?: number, step?: number) => void
  onRemoveGate: (step: number, qubit: number) => void
}

interface GateItemProps {
  gate: string
  qubit: number
  step: number
  controls?: number[]
  onRemove: () => void
}

interface DropTargetProps {
  qubit: number
  step: number
  onDrop: (gate: string, qubit: number, step: number) => void
}

const GateItem = ({ gate, qubit, step, controls = [], onRemove }: GateItemProps) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  const getGateColor = (gate: string) => {
    const colors: Record<string, string> = {
      // Single-qubit gates
      H: "bg-blue-500",
      X: "bg-red-500",
      Y: "bg-green-500",
      Z: "bg-yellow-500",
      S: "bg-purple-500",
      T: "bg-pink-500",
      I: "bg-slate-500",
      U: "bg-teal-500",
      U3: "bg-teal-500",
      RX: "bg-amber-500",
      RY: "bg-amber-500",
      RZ: "bg-amber-500",
      SX: "bg-fuchsia-500",
      Phase: "bg-indigo-500",
      // Multi-qubit gates
      CNOT: "bg-indigo-500",
      CX: "bg-indigo-500",
      CY: "bg-indigo-500",
      CZ: "bg-indigo-500",
      CRX: "bg-orange-500",
      CRY: "bg-orange-500",
      CRZ: "bg-orange-500",
      CU: "bg-orange-500",
      CCX: "bg-orange-500",
      CS: "bg-orange-500",
      CT: "bg-orange-500",
      SWAP: "bg-orange-500",
      iSWAP: "bg-orange-500",
      CSWAP: "bg-orange-500",
      Fredkin: "bg-orange-500",
      RXX: "bg-cyan-500",
      RYY: "bg-cyan-500",
      RZZ: "bg-cyan-500",
      XX: "bg-cyan-500",
      YY: "bg-cyan-500",
      ZZ: "bg-cyan-500",
      // Special gates
      M: "bg-gray-500",
      Barrier: "bg-gray-500",
      Reset: "bg-gray-500",
      Delay: "bg-gray-500",
      Initialize: "bg-gray-500",
      CONTROL: "bg-gray-400",
    }
    return colors[gate] || "bg-gray-600"
  }

  const getGateDisplayLabel = (gate: string) => {
    const displayMap: Record<string, string> = {
      CNOT: "CX",
      iSWAP: "iSW",
      CSWAP: "CSW",
      Fredkin: "FRD",
      SX: "√X",
      Barrier: "||",
      Reset: "R",
      Delay: "D",
      Initialize: "In",
      Phase: "P",
      CONTROL: "●",
    }
    return displayMap[gate] || gate
  }

  const getControlLinePosition = (controlQubit: number) => {
    const distance = Math.abs(controlQubit - qubit)
    const isAbove = controlQubit < qubit
    const baseHeight = distance * 40 // Each qubit row is ~40px apart

    return {
      height: `${baseHeight}px`,
      top: isAbove ? "-20px" : "40px",
      left: "50%",
      transform: "translateX(-50%)",
    }
  }

  return (
    <div className="relative">
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center text-white font-bold text-xs sm:text-sm ${getGateColor(gate)}`}
      >
        {getGateDisplayLabel(gate)}
      </div>
      {controls.map((controlQubit, idx) => (
        <div key={idx} className="absolute w-1 bg-white" style={getControlLinePosition(controlQubit)} />
      ))}
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white hover:bg-red-600"
      >
        <X size={12} />
      </button>
    </div>
  )
}

export default function CircuitBuilder({ circuit, onAddGate, onRemoveGate }: CircuitBuilderProps) {
  const [selectedMobileGate, setSelectedMobileGate] = useState<string | null>(null)
  const [selectedControl, setSelectedControl] = useState<number | null>(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isDesktop = windowWidth >= 768

  const controlledGates = ["CNOT", "CZ", "CY", "CRX", "CRY", "CRZ", "CU", "CS", "CT", "iSWAP", "CCX", "CSWAP"]

  const mobileGates = [
    { gate: "H", label: "H" },
    { gate: "X", label: "X" },
    { gate: "Y", label: "Y" },
    { gate: "Z", label: "Z" },
    { gate: "S", label: "S" },
    { gate: "T", label: "T" },
    { gate: "I", label: "I" },
    { gate: "U", label: "U" },
    { gate: "U3", label: "U3" },
    { gate: "RX", label: "RX" },
    { gate: "RY", label: "RY" },
    { gate: "RZ", label: "RZ" },
    { gate: "SX", label: "√X" },
    { gate: "Phase", label: "P" },
    { gate: "CNOT", label: "CX" },
    { gate: "CY", label: "CY" },
    { gate: "CZ", label: "CZ" },
    { gate: "CRX", label: "CRX" },
    { gate: "CRY", label: "CRY" },
    { gate: "CRZ", label: "CRZ" },
    { gate: "CU", label: "CU" },
    { gate: "CCX", label: "CCX" },
    { gate: "CS", label: "CS" },
    { gate: "CT", label: "CT" },
    { gate: "SWAP", label: "⇄" },
    { gate: "iSWAP", label: "iSW" },
    { gate: "CSWAP", label: "CSW" },
    { gate: "Fredkin", label: "FRD" },
    { gate: "RXX", label: "RXX" },
    { gate: "RYY", label: "RYY" },
    { gate: "RZZ", label: "RZZ" },
    { gate: "XX", label: "XX" },
    { gate: "YY", label: "YY" },
    { gate: "ZZ", label: "ZZ" },
    { gate: "M", label: "M" },
    { gate: "Barrier", label: "||" },
    { gate: "Reset", label: "R" },
    { gate: "Delay", label: "D" },
    { gate: "Initialize", label: "In" },
  ]

  const getGateColor = (gate: string) => {
    const colors: Record<string, string> = {
      H: "bg-blue-500",
      X: "bg-red-500",
      Y: "bg-green-500",
      Z: "bg-yellow-500",
      S: "bg-purple-500",
      T: "bg-pink-500",
      I: "bg-slate-500",
      U: "bg-teal-500",
      U3: "bg-teal-500",
      RX: "bg-amber-500",
      RY: "bg-amber-500",
      RZ: "bg-amber-500",
      SX: "bg-fuchsia-500",
      Phase: "bg-indigo-500",
      CNOT: "bg-indigo-500",
      CX: "bg-indigo-500",
      CY: "bg-indigo-500",
      CZ: "bg-indigo-500",
      CRX: "bg-orange-500",
      CRY: "bg-orange-500",
      CRZ: "bg-orange-500",
      CU: "bg-orange-500",
      CCX: "bg-orange-500",
      CS: "bg-orange-500",
      CT: "bg-orange-500",
      SWAP: "bg-orange-500",
      iSWAP: "bg-orange-500",
      CSWAP: "bg-orange-500",
      Fredkin: "bg-orange-500",
      RXX: "bg-cyan-500",
      RYY: "bg-cyan-500",
      RZZ: "bg-cyan-500",
      XX: "bg-cyan-500",
      YY: "bg-cyan-500",
      ZZ: "bg-cyan-500",
      M: "bg-gray-500",
      Barrier: "bg-gray-500",
      Reset: "bg-gray-500",
      Delay: "bg-gray-500",
      Initialize: "bg-gray-500",
    }
    return colors[gate] || "bg-gray-600"
  }

  const handleGateDrop = (gate: string, qubit: number, step: number) => {
    if (selectedControl !== null && controlledGates.includes(gate)) {
      onAddGate(gate, qubit, selectedControl, step)
      setSelectedControl(null)
    } else if (controlledGates.includes(gate)) {
      setSelectedControl(qubit)
    } else {
      onAddGate(gate, qubit, undefined, step)
    }
  }

  const handleQubitClick = (qubit: number) => {
    if (selectedControl !== null) {
      if (selectedControl !== qubit) {
        onAddGate("CNOT", qubit, selectedControl)
      }
      setSelectedControl(null)
    }
  }

  const maxSteps = Math.max(10, circuit.getMaxSteps() + 3)

  const DropTarget = ({ qubit, step, onDrop }: DropTargetProps) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: "gate",
      drop: (item: { gate: string }) => {
        onDrop(item.gate, qubit, step)
        return { qubit, step }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }))

    const handleTap = () => {
      if (selectedMobileGate) {
        if (selectedControl !== null && controlledGates.includes(selectedMobileGate)) {
          onAddGate(selectedMobileGate, qubit, selectedControl, step)
          setSelectedControl(null)
        } else if (controlledGates.includes(selectedMobileGate)) {
          setSelectedControl(qubit)
        } else {
          onAddGate(selectedMobileGate, qubit, undefined, step)
        }
        setSelectedMobileGate(null)
      } else if (selectedControl !== null) {
        if (selectedControl !== qubit) {
          onAddGate("CNOT", qubit, selectedControl, step)
        }
        setSelectedControl(null)
      }
    }

    return (
      <div
        ref={drop}
        onClick={handleTap}
        className={`w-8 h-8 sm:w-10 sm:h-10 border border-dashed border-gray-500 rounded-md 
        ${isOver ? "bg-gray-300 dark:bg-gray-700" : "bg-transparent"}`}
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      {!isDesktop && (
        <div className="mb-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Select a gate to place</h3>

          <div className="max-h-64 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">
            <div className="grid grid-cols-3 gap-2">
              {mobileGates.map((gate) => (
                <button
                  key={gate.gate}
                  onClick={() => setSelectedMobileGate(gate.gate)}
                  className={`h-10 rounded-md flex items-center justify-center text-white font-bold text-xs
                    ${getGateColor(gate.gate)}
                    ${selectedMobileGate === gate.gate ? "ring-2 ring-white" : ""}
                  `}
                >
                  {gate.label}
                </button>
              ))}
            </div>
          </div>

          {selectedMobileGate && (
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-300">
              Tap on the circuit grid to place the {selectedMobileGate} gate
            </p>
          )}
        </div>
      )}
      <div className="md:hidden mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-300">
          <strong>Mobile tip:</strong> Select a gate from above, then tap on the grid to place it. Swipe horizontally to
          scroll through the circuit.
        </p>
      </div>
      <div className="min-w-max">
        <div className="flex mb-4 items-center">
          <div className="w-16 sm:w-20 flex-shrink-0"></div>
          {Array.from({ length: maxSteps }).map((_, step) => (
            <div key={step} className="w-8 sm:w-10 mx-1 text-center text-xs text-gray-500 dark:text-gray-400">
              {step + 1}
            </div>
          ))}
        </div>

        {Array.from({ length: circuit.numQubits }).map((_, qubit) => (
          <div key={qubit} className="flex mb-4 items-center">
            <div
              className={`w-16 sm:w-20 flex-shrink-0 text-right pr-2 sm:pr-4 font-mono ${
                selectedControl === qubit
                  ? "text-purple-600 dark:text-purple-400 font-bold"
                  : "text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => handleQubitClick(qubit)}
            >
              q{qubit}
            </div>
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700 relative">
              {Array.from({ length: maxSteps }).map((_, step) => {
                const gate = circuit.getGateAt(step, qubit)
                return (
                  <div
                    key={step}
                    className="absolute mx-1"
                    style={{ left: `${step * (windowWidth < 640 ? 36 : 48)}px` }}
                  >
                    {gate ? (
                      <GateItem
                        gate={gate.name}
                        qubit={qubit}
                        step={step}
                        controls={gate.controls}
                        onRemove={() => onRemoveGate(step, qubit)}
                      />
                    ) : (
                      <DropTarget
                        qubit={qubit}
                        step={step}
                        onDrop={(gate, qubit, step) => handleGateDrop(gate, qubit, step)}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {selectedControl !== null && (
          <div className="mt-4 p-2 bg-purple-100 dark:bg-purple-900 rounded-md">
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Control qubit q{selectedControl} selected. Click on a target qubit to add a controlled operation.
            </p>
            <button
              onClick={() => setSelectedControl(null)}
              className="mt-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
