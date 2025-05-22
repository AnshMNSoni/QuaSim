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
      H: "bg-blue-500",
      X: "bg-red-500",
      Y: "bg-green-500",
      Z: "bg-yellow-500",
      S: "bg-purple-500",
      T: "bg-pink-500",
      CNOT: "bg-indigo-500",
      SWAP: "bg-orange-500",
      M: "bg-gray-500",
    }
    return colors[gate] || "bg-gray-600"
  }

  return (
    <div className="relative">
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center text-white font-bold text-xs sm:text-sm ${getGateColor(gate)}`}
      >
        {gate === "CNOT" ? (windowWidth < 640 ? "CX" : "CNOT") : gate}
      </div>
      {controls.map((controlQubit, idx) => (
        <div
          key={idx}
          className="absolute w-1 bg-white"
          style={{
            height: `${Math.abs(controlQubit - qubit) * 40}px`,
            left: "20px",
            top: controlQubit < qubit ? "-20px" : "40px",
            transform: "translateY(-50%)",
          }}
        />
      ))}
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white"
      >
        <X size={12} />
      </button>
    </div>
  )
}

export default function CircuitBuilder({ circuit, onAddGate, onRemoveGate }: CircuitBuilderProps) {
  const [selectedControl, setSelectedControl] = useState<number | null>(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)
  const [selectedMobileGate, setSelectedMobileGate] = useState<string | null>(null)

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

  const handleGateDrop = (gate: string, qubit: number, step: number) => {
    if (selectedControl !== null && (gate === "CNOT" || gate === "CZ")) {
      onAddGate(gate, qubit, selectedControl, step)
      setSelectedControl(null)
    } else if (gate === "CNOT" || gate === "CZ") {
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

  // Calculate the number of steps needed
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

    // This function will handle mobile taps with the correct qubit
    const handleTap = () => {
      if (selectedMobileGate) {
        // If a gate is already selected, place it at this qubit and step
        if (selectedControl !== null && (selectedMobileGate === "CNOT" || selectedMobileGate === "CZ")) {
          onAddGate(selectedMobileGate, qubit, selectedControl, step)
          setSelectedControl(null)
        } else if (selectedMobileGate === "CNOT" || selectedMobileGate === "CZ") {
          setSelectedControl(qubit)
        } else {
          onAddGate(selectedMobileGate, qubit, undefined, step)
        }
        setSelectedMobileGate(null) // Clear selection after placement
      } else if (selectedControl !== null) {
        // If a control qubit is selected, use this qubit as target
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
      <div className="md:hidden mb-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Select a gate to place:</h3>
        <div className="flex flex-wrap gap-2">
          {["H", "X", "Y", "Z", "CNOT", "CZ"].map((gate) => (
            <button
              key={gate}
              onClick={() => setSelectedMobileGate(gate)}
              className={`w-10 h-10 rounded-md flex items-center justify-center text-white font-bold
          ${selectedMobileGate === gate ? "ring-2 ring-white" : ""}
          ${
            gate === "H"
              ? "bg-blue-500"
              : gate === "X"
                ? "bg-red-500"
                : gate === "Y"
                  ? "bg-green-500"
                  : gate === "Z"
                    ? "bg-yellow-500"
                    : gate === "CNOT"
                      ? "bg-indigo-500"
                      : gate === "CZ"
                        ? "bg-purple-500"
                        : "bg-gray-500"
          }`}
            >
              {gate}
            </button>
          ))}
          {selectedMobileGate && (
            <button
              onClick={() => setSelectedMobileGate(null)}
              className="px-2 py-1 bg-gray-400 dark:bg-gray-600 rounded-md text-sm"
            >
              Cancel
            </button>
          )}
        </div>
        {selectedMobileGate && (
          <p className="text-xs mt-2 text-gray-600 dark:text-gray-300">
            Tap on the circuit grid to place the {selectedMobileGate} gate
          </p>
        )}
        {selectedControl !== null && (
          <p className="text-xs mt-2 text-purple-600 dark:text-purple-300">
            Control qubit q{selectedControl} selected. Tap on a target qubit.
          </p>
        )}
      </div>
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
