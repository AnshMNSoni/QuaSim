import { Complex } from "./complex"
import type { QuantumCircuit } from "./quantum-circuit"
import type { SimulationResult } from "./types"

// Single-qubit gates
const H_GATE = [
  [new Complex(1 / Math.sqrt(2)), new Complex(1 / Math.sqrt(2))],
  [new Complex(1 / Math.sqrt(2)), new Complex(-1 / Math.sqrt(2))],
]

const X_GATE = [
  [new Complex(0), new Complex(1)],
  [new Complex(1), new Complex(0)],
]

const Y_GATE = [
  [new Complex(0), new Complex(0, -1)],
  [new Complex(0, 1), new Complex(0)],
]

const Z_GATE = [
  [new Complex(1), new Complex(0)],
  [new Complex(0), new Complex(-1)],
]

const S_GATE = [
  [new Complex(1), new Complex(0)],
  [new Complex(0), new Complex(0, 1)],
]

const T_GATE = [
  [new Complex(1), new Complex(0)],
  [new Complex(0), new Complex(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4))],
]

export async function simulateCircuit(circuit: QuantumCircuit): Promise<SimulationResult> {
  // Initialize state vector |0...0⟩
  const numStates = 1 << circuit.numQubits
  let stateVector: Complex[] = Array(numStates)
    .fill(null)
    .map(() => new Complex(0))
  stateVector[0] = new Complex(1) // |0...0⟩ state

  // Apply each gate in the circuit
  for (let step = 0; step < circuit.gates.length; step++) {
    for (const gate of circuit.gates[step]) {
      stateVector = applyGate(stateVector, gate, circuit.numQubits)
    }
  }

  // Calculate probabilities
  const probabilities: Record<string, number> = {}
  for (let i = 0; i < stateVector.length; i++) {
    const prob = stateVector[i].magnitude() ** 2
    if (prob > 1e-10) {
      // Ignore very small probabilities
      const bitString = i.toString(2).padStart(circuit.numQubits, "0")
      probabilities[bitString] = prob
    }
  }

  return {
    stateVector,
    probabilities,
  }
}

function applyGate(stateVector: Complex[], gate: any, numQubits: number): Complex[] {
  const { name, qubit, controls } = gate

  switch (name) {
    case "H":
      return applySingleQubitGate(stateVector, H_GATE, qubit, numQubits)
    case "X":
      return applySingleQubitGate(stateVector, X_GATE, qubit, numQubits)
    case "Y":
      return applySingleQubitGate(stateVector, Y_GATE, qubit, numQubits)
    case "Z":
      return applySingleQubitGate(stateVector, Z_GATE, qubit, numQubits)
    case "S":
      return applySingleQubitGate(stateVector, S_GATE, qubit, numQubits)
    case "T":
      return applySingleQubitGate(stateVector, T_GATE, qubit, numQubits)
    case "CNOT":
      return applyControlledGate(stateVector, X_GATE, qubit, controls![0], numQubits)
    case "CZ":
      return applyControlledGate(stateVector, Z_GATE, qubit, controls![0], numQubits)
    case "SWAP":
      return applySwapGate(stateVector, qubit, controls![0], numQubits)
    case "M":
      // Measurement is handled differently in a simulator
      // For now, we'll just return the state vector unchanged
      return stateVector
    default:
      return stateVector
  }
}

function applySingleQubitGate(stateVector: Complex[], gate: Complex[][], qubit: number, numQubits: number): Complex[] {
  const newStateVector = Array(stateVector.length)
    .fill(null)
    .map(() => new Complex(0))

  for (let i = 0; i < stateVector.length; i++) {
    // Check if the qubit is 0 or 1 in this basis state
    const bit = (i >> qubit) & 1

    // Apply gate to the qubit
    for (let j = 0; j < 2; j++) {
      const newBit = j
      // Flip the qubit bit to get the new state index
      const newIndex = (i & ~(1 << qubit)) | (newBit << qubit)

      // Apply the gate element
      const contribution = stateVector[i].multiply(gate[newBit][bit])
      newStateVector[newIndex] = newStateVector[newIndex].add(contribution)
    }
  }

  return newStateVector
}

function applyControlledGate(
  stateVector: Complex[],
  gate: Complex[][],
  targetQubit: number,
  controlQubit: number,
  numQubits: number,
): Complex[] {
  const newStateVector = Array(stateVector.length)
    .fill(null)
    .map((_, i) => new Complex(stateVector[i].real, stateVector[i].imag))

  for (let i = 0; i < stateVector.length; i++) {
    // Check if the control qubit is 1
    const controlBit = (i >> controlQubit) & 1

    if (controlBit === 1) {
      // Apply the gate to the target qubit
      const targetBit = (i >> targetQubit) & 1

      // Calculate the new state index with the target bit flipped
      const newTargetBit = targetBit === 0 ? 1 : 0
      const newIndex = (i & ~(1 << targetQubit)) | (newTargetBit << targetQubit)

      // Apply the gate element
      newStateVector[i] = new Complex(0)
      newStateVector[newIndex] = stateVector[i].multiply(gate[newTargetBit][targetBit])
    }
  }

  return newStateVector
}

function applySwapGate(stateVector: Complex[], qubit1: number, qubit2: number, numQubits: number): Complex[] {
  const newStateVector = Array(stateVector.length)
    .fill(null)
    .map(() => new Complex(0))

  for (let i = 0; i < stateVector.length; i++) {
    // Get the bits at qubit1 and qubit2
    const bit1 = (i >> qubit1) & 1
    const bit2 = (i >> qubit2) & 1

    // If the bits are the same, the state doesn't change
    if (bit1 === bit2) {
      newStateVector[i] = stateVector[i]
    } else {
      // Swap the bits
      const newIndex = i ^ (1 << qubit1) ^ (1 << qubit2)
      newStateVector[newIndex] = stateVector[i]
    }
  }

  return newStateVector
}
