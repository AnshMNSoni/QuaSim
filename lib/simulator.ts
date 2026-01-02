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

const I_GATE = [
  [new Complex(1), new Complex(0)],
  [new Complex(0), new Complex(1)],
]

const SX_GATE = [
  [new Complex(0.5, 0.5), new Complex(0.5, -0.5)],
  [new Complex(0.5, -0.5), new Complex(0.5, 0.5)],
]

const PHASE_GATE = (angle: number) => [
  [new Complex(1), new Complex(0)],
  [new Complex(0), new Complex(Math.cos(angle), Math.sin(angle))],
]

const RX_GATE = (angle: number) => [
  [new Complex(Math.cos(angle / 2)), new Complex(0, -Math.sin(angle / 2))],
  [new Complex(0, -Math.sin(angle / 2)), new Complex(Math.cos(angle / 2))],
]

const RY_GATE = (angle: number) => [
  [new Complex(Math.cos(angle / 2)), new Complex(-Math.sin(angle / 2))],
  [new Complex(Math.sin(angle / 2)), new Complex(Math.cos(angle / 2))],
]

const RZ_GATE = (angle: number) => [
  [new Complex(Math.cos(angle / 2), -Math.sin(angle / 2)), new Complex(0)],
  [new Complex(0), new Complex(Math.cos(angle / 2), Math.sin(angle / 2))],
]

const U_GATE = (theta: number, phi: number, lambda: number) => [
  [new Complex(Math.cos(theta / 2)), new Complex(-Math.cos(lambda), -Math.sin(lambda)) * Math.sin(theta / 2)],
  [
    new Complex(Math.cos(phi), Math.sin(phi)) * Math.sin(theta / 2),
    new Complex(Math.cos(phi + lambda), Math.sin(phi + lambda)) * Math.cos(theta / 2),
  ],
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
    case "I":
      return applySingleQubitGate(stateVector, I_GATE, qubit, numQubits)
    case "SX":
      return applySingleQubitGate(stateVector, SX_GATE, qubit, numQubits)
    case "U":
      return applySingleQubitGate(stateVector, U_GATE(Math.PI / 4, 0, 0), qubit, numQubits)
    case "U3":
      return applySingleQubitGate(stateVector, U_GATE(Math.PI / 4, 0, 0), qubit, numQubits)
    case "RX":
      return applySingleQubitGate(stateVector, RX_GATE(Math.PI / 4), qubit, numQubits)
    case "RY":
      return applySingleQubitGate(stateVector, RY_GATE(Math.PI / 4), qubit, numQubits)
    case "RZ":
      return applySingleQubitGate(stateVector, RZ_GATE(Math.PI / 4), qubit, numQubits)
    case "Phase":
      return applySingleQubitGate(stateVector, PHASE_GATE(Math.PI / 4), qubit, numQubits)
    case "CNOT":
      return applyControlledGate(stateVector, X_GATE, qubit, controls![0], numQubits)
    case "CY":
      return applyControlledGate(stateVector, Y_GATE, qubit, controls![0], numQubits)
    case "CZ":
      return applyControlledGate(stateVector, Z_GATE, qubit, controls![0], numQubits)
    case "CRX":
      return applyControlledGate(stateVector, RX_GATE(Math.PI / 4), qubit, controls![0], numQubits)
    case "CRY":
      return applyControlledGate(stateVector, RY_GATE(Math.PI / 4), qubit, controls![0], numQubits)
    case "CRZ":
      return applyControlledGate(stateVector, RZ_GATE(Math.PI / 4), qubit, controls![0], numQubits)
    case "CU":
      return applyControlledGate(stateVector, U_GATE(Math.PI / 4, 0, 0), qubit, controls![0], numQubits)
    case "CS":
      return applyControlledGate(stateVector, S_GATE, qubit, controls![0], numQubits)
    case "CT":
      return applyControlledGate(stateVector, T_GATE, qubit, controls![0], numQubits)
    case "CCX":
      // Toffoli gate - controlled controlled X
      return applyToffoliGate(stateVector, qubit, controls![0], numQubits)
    case "CSWAP":
    case "Fredkin":
      return applyControlledSwapGate(stateVector, qubit, controls![0], numQubits)
    case "SWAP":
    case "iSWAP":
      return applySwapGate(stateVector, qubit, controls![0], numQubits)
    case "RXX":
    case "RYY":
    case "RZZ":
    case "XX":
    case "YY":
    case "ZZ":
      // Two-qubit interaction gates
      return applyTwoQubitInteractionGate(stateVector, name, qubit, controls![0], numQubits)
    case "Barrier":
    case "Reset":
    case "Delay":
    case "Initialize":
    case "M":
      // These gates don't affect the quantum state in simulation
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

function applyToffoliGate(
  stateVector: Complex[],
  targetQubit: number,
  control1Qubit: number,
  numQubits: number,
  control2Qubit?: number,
): Complex[] {
  const newStateVector = Array(stateVector.length)
    .fill(null)
    .map((_, i) => new Complex(stateVector[i].real, stateVector[i].imag))

  for (let i = 0; i < stateVector.length; i++) {
    // Check if both control qubits are 1 (CCX has implicit second control in controls array)
    const control1Bit = (i >> control1Qubit) & 1
    const control2Bit = control2Qubit !== undefined ? (i >> control2Qubit) & 1 : 1

    if (control1Bit === 1 && control2Bit === 1) {
      // Apply X gate to the target qubit
      const targetBit = (i >> targetQubit) & 1
      const newTargetBit = targetBit === 0 ? 1 : 0
      const newIndex = (i & ~(1 << targetQubit)) | (newTargetBit << targetQubit)

      newStateVector[i] = new Complex(0)
      newStateVector[newIndex] = stateVector[i]
    }
  }

  return newStateVector
}

function applyControlledSwapGate(
  stateVector: Complex[],
  qubit1: number,
  controlQubit: number,
  numQubits: number,
): Complex[] {
  const newStateVector = Array(stateVector.length)
    .fill(null)
    .map(() => new Complex(0))

  for (let i = 0; i < stateVector.length; i++) {
    const controlBit = (i >> controlQubit) & 1

    if (controlBit === 1) {
      // Swap qubit1 and the next qubit
      const bit1 = (i >> qubit1) & 1
      const bit2 = (i >> (qubit1 + 1)) & 1

      if (bit1 !== bit2) {
        const newIndex = i ^ (1 << qubit1) ^ (1 << (qubit1 + 1))
        newStateVector[newIndex] = stateVector[i]
      } else {
        newStateVector[i] = stateVector[i]
      }
    } else {
      newStateVector[i] = stateVector[i]
    }
  }

  return newStateVector
}

function applyTwoQubitInteractionGate(
  stateVector: Complex[],
  gateName: string,
  qubit1: number,
  qubit2: number,
  numQubits: number,
): Complex[] {
  // For RXX, RYY, RZZ, XX, YY, ZZ gates - apply interaction between two qubits
  const newStateVector = Array(stateVector.length)
    .fill(null)
    .map(() => new Complex(0))

  const angle = Math.PI / 4 // Default angle for demonstration

  for (let i = 0; i < stateVector.length; i++) {
    const bit1 = (i >> qubit1) & 1
    const bit2 = (i >> qubit2) & 1

    let newIndex = i
    let phase = new Complex(1)

    switch (gateName) {
      case "XX":
      case "RXX":
        if (bit1 !== bit2) {
          newIndex = i ^ (1 << qubit1) ^ (1 << qubit2)
          phase = new Complex(Math.cos(angle / 2), 0)
        } else {
          phase = new Complex(Math.cos(angle / 2), -Math.sin(angle / 2))
        }
        break
      case "YY":
      case "RYY":
        if (bit1 !== bit2) {
          newIndex = i ^ (1 << qubit1) ^ (1 << qubit2)
          phase = new Complex(Math.cos(angle / 2), 0)
        } else {
          phase = new Complex(Math.cos(angle / 2), Math.sin(angle / 2))
        }
        break
      case "ZZ":
      case "RZZ":
        phase =
          bit1 === bit2
            ? new Complex(Math.cos(angle / 2), -Math.sin(angle / 2))
            : new Complex(Math.cos(angle / 2), Math.sin(angle / 2))
        break
    }

    newStateVector[newIndex] = newStateVector[newIndex].add(stateVector[i].multiply(phase))
  }

  return newStateVector
}
