"use client"

import { useEffect, useRef } from "react"
import type { QuantumCircuit } from "@/lib/quantum-circuit"
import type { SimulationResult } from "@/lib/types"
import { drawBlochSphere, drawHistogram, drawCircuitDiagram, drawStateVector } from "@/lib/visualizations"

interface VisualizationPanelProps {
  result: SimulationResult
  circuit: QuantumCircuit
  activeVisualization: string
}

export default function VisualizationPanel({ result, circuit, activeVisualization }: VisualizationPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !result) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Adjust canvas size based on visualization type
    if (activeVisualization === "circuit") {
      canvas.width = Math.max(800, circuit.getMaxSteps() * 60 + 100)
      canvas.height = circuit.numQubits * 60 + 100
      drawCircuitDiagram(ctx, circuit)
    } else if (activeVisualization === "bloch") {
      canvas.width = circuit.numQubits * 200
      canvas.height = 300
      drawBlochSphere(ctx, result.stateVector, circuit.numQubits)
    } else if (activeVisualization === "histogram") {
      canvas.width = 800
      canvas.height = 400
      drawHistogram(ctx, result.probabilities)
    } else if (activeVisualization === "statevector") {
      canvas.width = 800
      canvas.height = 400
      drawStateVector(ctx, result.stateVector)
    }
  }, [result, circuit, activeVisualization])

  return (
    <div className="visualization-container overflow-auto">
      <div className="bg-white dark:bg-black rounded-lg p-2 overflow-auto">
        <canvas ref={canvasRef} className="mx-auto" />
      </div>
    </div>
  )
}
