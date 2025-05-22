export interface Gate {
  name: string
  qubit: number
  controls?: number[]
}

export class QuantumCircuit {
  numQubits: number
  gates: Gate[][]

  constructor(numQubits: number) {
    this.numQubits = numQubits
    this.gates = []
  }

  addQubit(): void {
    this.numQubits++
  }

  removeQubit(): void {
    if (this.numQubits <= 1) return

    // Remove gates on the last qubit
    this.gates = this.gates.map((step) =>
      step.filter((gate) => gate.qubit !== this.numQubits - 1 && !gate.controls?.includes(this.numQubits - 1)),
    )

    // Filter out empty steps
    this.gates = this.gates.filter((step) => step.length > 0)

    this.numQubits--
  }

  addGate(gateName: string, qubit: number, control?: number): void {
    if (qubit >= this.numQubits) return

    const step = this.getNextAvailableStep(qubit)

    if (!this.gates[step]) {
      this.gates[step] = []
    }

    const gate: Gate = { name: gateName, qubit }

    if (control !== undefined) {
      gate.controls = [control]
    }

    this.gates[step].push(gate)
  }

  // New method to add a gate at a specific step
  addGateAtStep(gateName: string, qubit: number, step: number, control?: number): void {
    if (qubit >= this.numQubits) return

    // Ensure the step exists in the gates array
    while (this.gates.length <= step) {
      this.gates.push([])
    }

    // Check if the qubit is already used at this step
    const isQubitUsed = this.gates[step].some((gate) => gate.qubit === qubit || gate.controls?.includes(qubit))
    if (isQubitUsed) {
      // If the qubit is already used, find the next available step
      const nextStep = this.getNextAvailableStep(qubit)
      this.addGateAtStep(gateName, qubit, nextStep, control)
      return
    }

    const gate: Gate = { name: gateName, qubit }

    if (control !== undefined) {
      gate.controls = [control]
    }

    this.gates[step].push(gate)
  }

  removeGate(step: number, qubit: number): void {
    if (!this.gates[step]) return

    this.gates[step] = this.gates[step].filter((gate) => !(gate.qubit === qubit || gate.controls?.includes(qubit)))

    // Remove empty steps
    if (this.gates[step].length === 0) {
      this.gates.splice(step, 1)
    }
  }

  getGateAt(step: number, qubit: number): Gate | null {
    if (!this.gates[step]) return null

    const gate = this.gates[step].find((g) => g.qubit === qubit)
    if (gate) return gate

    // Check if this qubit is a control for another gate
    const controlledGate = this.gates[step].find((g) => g.controls?.includes(qubit))
    if (controlledGate) {
      return {
        name: "CONTROL",
        qubit: qubit,
        controls: [],
      }
    }

    return null
  }

  getMaxSteps(): number {
    return this.gates.length
  }

  private getNextAvailableStep(qubit: number): number {
    // Find the first step where the qubit is not used
    for (let i = 0; i <= this.gates.length; i++) {
      // If we're at the end of the gates array, return this index to add a new step
      if (i === this.gates.length) {
        return i
      }

      // Check if this qubit is used at this step
      const isQubitUsed = this.gates[i].some((gate) => gate.qubit === qubit || gate.controls?.includes(qubit))

      if (!isQubitUsed) {
        return i
      }
    }

    // If all steps have the qubit used, add a new step
    return this.gates.length
  }

  clone(): QuantumCircuit {
    const newCircuit = new QuantumCircuit(this.numQubits)
    newCircuit.gates = JSON.parse(JSON.stringify(this.gates))
    return newCircuit
  }

  serialize(): any {
    return {
      numQubits: this.numQubits,
      gates: this.gates,
    }
  }

  static deserialize(data: any): QuantumCircuit {
    const circuit = new QuantumCircuit(data.numQubits)
    circuit.gates = data.gates
    return circuit
  }
}
