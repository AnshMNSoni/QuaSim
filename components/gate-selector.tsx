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
}

const DraggableGate = ({ gate, label }: DraggableGateProps) => {
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
      I: "bg-slate-500",
      U: "bg-teal-500",
      U3: "bg-teal-500",
      RX: "bg-amber-500",
      RY: "bg-amber-500",
      RZ: "bg-amber-500",
      SX: "bg-fuchsia-500",
      Phase: "bg-indigo-500",
      CNOT: "bg-indigo-500",
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

  return (
    <div
      ref={drag}
      className={`w-full h-12 rounded-md flex items-center justify-center cursor-grab font-bold text-white text-sm
        ${getGateColor(gate)}
        ${isDragging ? "opacity-50" : ""}
      `}
      title={gate}
    >
      {label}
    </div>
  )
}

export default function GateSelector({ onSelectGate }: GateSelectorProps) {
  const gates = [
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

  return (
    <div className="hidden md:flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-2">Select a gate to place</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Drag and drop gates onto the circuit
      </p>

      <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[500px]">
        {gates.map((g) => (
          <DraggableGate key={g.gate} gate={g.gate} label={g.label} />
        ))}
      </div>
    </div>
  )
}
