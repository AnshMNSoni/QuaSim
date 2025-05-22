import { Complex } from "./complex"
import type { QuantumCircuit } from "./quantum-circuit"

export function drawCircuitDiagram(ctx: CanvasRenderingContext2D, circuit: QuantumCircuit): void {
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  const numQubits = circuit.numQubits
  const maxSteps = Math.max(10, circuit.getMaxSteps())

  // Clear canvas
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, width, height)

  // Draw qubit lines
  const lineSpacing = height / (numQubits + 1)
  ctx.strokeStyle = "#555"
  ctx.lineWidth = 1

  for (let i = 0; i < numQubits; i++) {
    const y = (i + 1) * lineSpacing
    ctx.beginPath()
    ctx.moveTo(50, y)
    ctx.lineTo(width - 50, y)
    ctx.stroke()

    // Draw qubit label
    ctx.fillStyle = "white"
    ctx.font = "14px Arial"
    ctx.textAlign = "right"
    ctx.fillText(`q${i}:`, 40, y + 5)
  }

  // Draw gates
  const gateWidth = 40
  const gateSpacing = (width - 100) / maxSteps

  for (let step = 0; step < circuit.gates.length; step++) {
    for (const gate of circuit.gates[step]) {
      const x = 50 + step * gateSpacing
      const y = (gate.qubit + 1) * lineSpacing

      // Draw gate
      drawGate(ctx, gate.name, x, y, gateWidth)

      // Draw control lines if needed
      if (gate.controls && gate.controls.length > 0) {
        for (const controlQubit of gate.controls) {
          const controlY = (controlQubit + 1) * lineSpacing

          // Draw vertical line connecting control and target
          ctx.strokeStyle = "white"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(x + gateWidth / 2, controlY)
          ctx.lineTo(x + gateWidth / 2, y)
          ctx.stroke()

          // Draw control point
          ctx.fillStyle = "white"
          ctx.beginPath()
          ctx.arc(x + gateWidth / 2, controlY, 5, 0, 2 * Math.PI)
          ctx.fill()
        }
      }
    }
  }
}

function drawGate(ctx: CanvasRenderingContext2D, gateName: string, x: number, y: number, size: number): void {
  const gateColors: Record<string, string> = {
    H: "#3b82f6", // blue
    X: "#ef4444", // red
    Y: "#22c55e", // green
    Z: "#eab308", // yellow
    S: "#a855f7", // purple
    T: "#ec4899", // pink
    CNOT: "#6366f1", // indigo
    CZ: "#6366f1", // indigo
    SWAP: "#f97316", // orange
    M: "#6b7280", // gray
    CONTROL: "white",
  }

  // Draw gate box
  ctx.fillStyle = gateColors[gateName] || "#6b7280"

  if (gateName === "CONTROL") {
    // Draw control point
    ctx.beginPath()
    ctx.arc(x + size / 2, y, 5, 0, 2 * Math.PI)
    ctx.fill()
    return
  }

  ctx.fillRect(x - size / 2, y - size / 2, size, size)

  // Draw gate label
  ctx.fillStyle = "white"
  ctx.font = "bold 16px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  let label = gateName
  if (gateName === "CNOT") label = "X"
  if (gateName === "SWAP") label = "⇄"

  ctx.fillText(label, x, y)
}

export function drawBlochSphere(ctx: CanvasRenderingContext2D, stateVector: Complex[], numQubits: number): void {
  const width = ctx.canvas.width
  const height = ctx.canvas.height

  // Clear canvas
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, width, height)

  // Calculate the size and spacing of each Bloch sphere
  const sphereRadius = Math.min(height / 2 - 20, width / (numQubits * 2) - 20)
  const sphereSpacing = width / numQubits

  // Draw each qubit's Bloch sphere
  for (let qubit = 0; qubit < numQubits; qubit++) {
    const centerX = (qubit + 0.5) * sphereSpacing
    const centerY = height / 2

    // Draw sphere outline
    ctx.strokeStyle = "#555"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(centerX, centerY, sphereRadius, 0, 2 * Math.PI)
    ctx.stroke()

    // Draw x, y, z axes
    ctx.strokeStyle = "#f00" // x-axis (red)
    ctx.beginPath()
    ctx.moveTo(centerX - sphereRadius, centerY)
    ctx.lineTo(centerX + sphereRadius, centerY)
    ctx.stroke()

    ctx.strokeStyle = "#0f0" // y-axis (green)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - sphereRadius)
    ctx.lineTo(centerX, centerY + sphereRadius)
    ctx.stroke()

    ctx.strokeStyle = "#00f" // z-axis (blue)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX, centerY - sphereRadius)
    ctx.stroke()

    // Calculate qubit state
    const { x, y, z } = calculateBlochCoordinates(stateVector, qubit, numQubits)

    // Draw state vector
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + x * sphereRadius, centerY - z * sphereRadius)
    ctx.stroke()

    // Draw state point
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(centerX + x * sphereRadius, centerY - z * sphereRadius, 4, 0, 2 * Math.PI)
    ctx.fill()

    // Draw qubit label
    ctx.fillStyle = "white"
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`Qubit ${qubit}`, centerX, centerY + sphereRadius + 20)
  }
}

function calculateBlochCoordinates(
  stateVector: Complex[],
  qubit: number,
  numQubits: number,
): { x: number; y: number; z: number } {
  // Default to |0⟩ state
  let x = 0,
    y = 0,
    z = 1

  // Calculate reduced density matrix for this qubit
  let rho00 = new Complex(0)
  let rho01 = new Complex(0)
  let rho10 = new Complex(0)
  let rho11 = new Complex(0)

  for (let i = 0; i < stateVector.length; i++) {
    const bit = (i >> qubit) & 1
    const amplitude = stateVector[i]

    for (let j = 0; j < stateVector.length; j++) {
      const bit2 = (j >> qubit) & 1
      const amplitude2 = stateVector[j].conjugate()

      if (bit === 0 && bit2 === 0) {
        rho00 = rho00.add(amplitude.multiply(amplitude2))
      } else if (bit === 0 && bit2 === 1) {
        rho01 = rho01.add(amplitude.multiply(amplitude2))
      } else if (bit === 1 && bit2 === 0) {
        rho10 = rho10.add(amplitude.multiply(amplitude2))
      } else if (bit === 1 && bit2 === 1) {
        rho11 = rho11.add(amplitude.multiply(amplitude2))
      }
    }
  }

  // Calculate Bloch sphere coordinates
  x = 2 * rho01.real
  y = 2 * rho01.imag
  z = rho00.real - rho11.real

  // Normalize
  const norm = Math.sqrt(x * x + y * y + z * z)
  if (norm > 0) {
    x /= norm
    y /= norm
    z /= norm
  }

  return { x, y, z }
}

export function drawHistogram(ctx: CanvasRenderingContext2D, probabilities: Record<string, number>): void {
  const width = ctx.canvas.width
  const height = ctx.canvas.height

  // Clear canvas
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, width, height)

  // Sort probabilities by state
  const states = Object.keys(probabilities).sort()
  const numStates = states.length

  if (numStates === 0) return

  // Calculate bar width and spacing
  const barWidth = Math.min(50, (width - 100) / numStates)
  const barSpacing = Math.min(10, barWidth / 4)

  // Find maximum probability for scaling
  const maxProb = Math.max(...Object.values(probabilities))

  // Draw axes
  ctx.strokeStyle = "white"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(50, height - 50)
  ctx.lineTo(width - 50, height - 50) // x-axis
  ctx.moveTo(50, height - 50)
  ctx.lineTo(50, 50) // y-axis
  ctx.stroke()

  // Draw axis labels
  ctx.fillStyle = "white"
  ctx.font = "14px Arial"
  ctx.textAlign = "center"
  ctx.fillText("Basis States", width / 2, height - 20)

  ctx.textAlign = "right"
  ctx.textBaseline = "middle"
  ctx.fillText("0", 40, height - 50)
  ctx.fillText(maxProb.toFixed(2), 40, 50)

  // Draw bars
  for (let i = 0; i < numStates; i++) {
    const state = states[i]
    const prob = probabilities[state]

    const barHeight = ((height - 100) * prob) / maxProb
    const x = 50 + i * (barWidth + barSpacing)
    const y = height - 50 - barHeight

    // Draw bar
    ctx.fillStyle = `hsl(${(i * 360) / numStates}, 70%, 60%)`
    ctx.fillRect(x, y, barWidth, barHeight)

    // Draw state label
    ctx.fillStyle = "white"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText(state, x + barWidth / 2, height - 45)

    // Draw probability value
    if (barHeight > 20) {
      ctx.textAlign = "center"
      ctx.textBaseline = "bottom"
      ctx.fillText(prob.toFixed(2), x + barWidth / 2, y)
    }
  }
}

export function drawStateVector(ctx: CanvasRenderingContext2D, stateVector: Complex[]): void {
  const width = ctx.canvas.width
  const height = ctx.canvas.height

  // Clear canvas
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, width, height)

  // Filter out very small amplitudes
  const significantStates: [number, Complex][] = []
  for (let i = 0; i < stateVector.length; i++) {
    if (stateVector[i].magnitude() > 1e-10) {
      significantStates.push([i, stateVector[i]])
    }
  }

  const numStates = significantStates.length
  if (numStates === 0) return

  // Calculate bar width and spacing
  const barWidth = Math.min(50, (width - 100) / numStates)
  const barSpacing = Math.min(10, barWidth / 4)

  // Draw axes
  ctx.strokeStyle = "white"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(50, height / 2)
  ctx.lineTo(width - 50, height / 2) // x-axis
  ctx.stroke()

  // Draw axis label
  ctx.fillStyle = "white"
  ctx.font = "14px Arial"
  ctx.textAlign = "center"
  ctx.fillText("Basis States", width / 2, height - 20)

  // Draw bars for amplitudes
  for (let i = 0; i < numStates; i++) {
    const [stateIndex, amplitude] = significantStates[i]
    const stateBinary = stateIndex.toString(2).padStart(Math.log2(stateVector.length), "0")

    const mag = amplitude.magnitude()
    const phase = amplitude.phase() * (180 / Math.PI)

    const barHeight = (height / 2 - 80) * mag
    const x = 50 + i * (barWidth + barSpacing)

    // Draw magnitude bar
    ctx.fillStyle = `hsl(${(phase + 180) % 360}, 70%, 60%)`
    ctx.fillRect(x, height / 2 - barHeight, barWidth, barHeight)

    // Draw phase indicator
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(x + barWidth / 2, height / 2 - barHeight - 10, 5, 0, 2 * Math.PI)
    ctx.fill()

    // Draw state label
    ctx.fillStyle = "white"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText(`|${stateBinary}⟩`, x + barWidth / 2, height / 2 + 10)

    // Draw amplitude value
    ctx.textAlign = "center"
    ctx.textBaseline = "bottom"
    ctx.fillText(`${mag.toFixed(2)}∠${phase.toFixed(0)}°`, x + barWidth / 2, height / 2 - barHeight - 15)
  }

  // Draw legend
  ctx.fillStyle = "white"
  ctx.font = "14px Arial"
  ctx.textAlign = "left"
  ctx.textBaseline = "middle"
  ctx.fillText("Amplitude = magnitude∠phase", 50, height - 50)

  // Draw color scale for phase
  const scaleWidth = 200
  const scaleHeight = 20
  const scaleX = width - 50 - scaleWidth
  const scaleY = height - 50

  for (let i = 0; i < scaleWidth; i++) {
    const hue = (i / scaleWidth) * 360
    ctx.fillStyle = `hsl(${hue}, 70%, 60%)`
    ctx.fillRect(scaleX + i, scaleY, 1, scaleHeight)
  }

  ctx.fillStyle = "white"
  ctx.textAlign = "center"
  ctx.textBaseline = "top"
  ctx.fillText("-180°", scaleX, scaleY + scaleHeight + 5)
  ctx.fillText("0°", scaleX + scaleWidth / 2, scaleY + scaleHeight + 5)
  ctx.fillText("180°", scaleX + scaleWidth, scaleY + scaleHeight + 5)
  ctx.fillText("Phase", scaleX + scaleWidth / 2, scaleY + scaleHeight + 25)
}
