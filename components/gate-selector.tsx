"use client"

import { useDrag } from "react-dnd"
import type { QuantumCircuit } from "@/lib/quantum-circuit"

interface GateSelectorProps {
  onSelectGate: (gate: string, qubit: number, control?: number) => void
  circuit: QuantumCircuit
}

interface DraggableGateProps {
  gate: string
  label: string
  description: string
  onSelectGate: (gate: string, qubit: number) => void
}

const DraggableGate = ({ gate, label, description, onSelectGate }: DraggableGateProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "gate",
    item: { gate },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const getGateColor = (gate: string) => {
    const colors: Record<string, string> = {
      H: "bg-blue-500",
      X: "bg-red-500",
      Y: "bg-green-500",
      Z: "bg-yellow-500",
      S: "bg-purple-500",
      T: "bg-pink-500",
      CNOT: "bg-indigo-500",
      CZ: "bg-indigo-500",
      SWAP: "bg-orange-500",
      M: "bg-gray-500",
    }
    return colors[gate] || "bg-gray-600"
  }

  // Add onClick handler for mobile
  const handleClick = () => {
    // Only trigger on mobile devices
    if (window.innerWidth < 768) {
      onSelectGate(gate, 0) // We'll handle the actual qubit selection in the circuit builder
    }
  }

  return (
    <div
      ref={drag}
      onClick={handleClick}
      className={`p-2 sm:p-3 rounded-md mb-2 cursor-grab ${getGateColor(gate)} ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-center">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-white font-bold border border-white text-xs sm:text-sm">
          {label}
        </div>
        <div className="ml-2 sm:ml-3">
          <h3 className="text-xs sm:text-sm font-semibold text-white">{gate} Gate</h3>
          <p className="text-[10px] sm:text-xs text-gray-200 hidden sm:block">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default function GateSelector({ onSelectGate, circuit }: GateSelectorProps) {
  const gates = [
    { gate: "H", label: "H", description: "Hadamard gate" },
    { gate: "X", label: "X", description: "Pauli-X (NOT) gate" },
    { gate: "Y", label: "Y", description: "Pauli-Y gate" },
    { gate: "Z", label: "Z", description: "Pauli-Z gate" },
    { gate: "S", label: "S", description: "Phase gate (π/2)" },
    { gate: "T", label: "T", description: "π/8 gate" },
    { gate: "CNOT", label: "CX", description: "Controlled-NOT gate" },
    { gate: "CZ", label: "CZ", description: "Controlled-Z gate" },
    { gate: "SWAP", label: "⇄", description: "SWAP gate" },
    { gate: "M", label: "M", description: "Measurement" },
  ]

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Quantum Gates</h2>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
        <span className="hidden md:inline">Drag and drop gates onto the circuit</span>
        <span className="md:hidden">Tap a gate to select, then tap on the circuit to place</span>
      </p>

      <div className="space-y-1 sm:space-y-2">
        {gates.map((gate) => (
          <DraggableGate
            key={gate.gate}
            gate={gate.gate}
            label={gate.label}
            description={gate.description}
            onSelectGate={onSelectGate}
          />
        ))}
      </div>
    </div>
  )
}
